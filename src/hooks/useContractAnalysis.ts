
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";
import { CONTRACT_ANALYZER_ABI, CONTRACT_ANALYZER_ADDRESS } from "@/contracts/ContractAnalyzer";

export const useContractAnalysis = (provider: any) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState("general");
  const [analyzedContractAddress, setAnalyzedContractAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const ensureAvalancheNetwork = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xa86a') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xa86a' }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa86a',
              chainName: 'Avalanche C-Chain',
              nativeCurrency: {
                name: 'AVAX',
                symbol: 'AVAX',
                decimals: 18
              },
              rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://snowtrace.io/']
            }],
          });
        } else {
          throw switchError;
        }
      }
    }
  };

  const handleAnalyzeContract = async (
    address: string,
    network: string,
    analysisType: string,
    jurisdiction: string,
    account: string | null
  ) => {
    if (!provider || !account) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisType(analysisType);
    setAnalyzedContractAddress(address);
    
    try {
      await ensureAvalancheNetwork();

      const { data: sourceData, error: sourceError } = await supabase.functions.invoke('analyze-contract', {
        body: {
          contract_address: address,
          network: network,
        },
      });

      if (sourceError) throw sourceError;

      if (sourceData.source_code) {
        setAnalysis(sourceData.source_code);
        
        const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-with-ai', {
          body: {
            source_code: sourceData.source_code,
            contract_address: address,
            analysis_type: analysisType,
            jurisdiction: jurisdiction,
          },
        });

        if (aiError) throw aiError;

        if (aiData.analysis) {
          setAiAnalysis(aiData.analysis);
          
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            CONTRACT_ANALYZER_ADDRESS,
            CONTRACT_ANALYZER_ABI,
            signer
          );

          const tx = await contract.addAnalysis(
            address,
            aiData.analysis,
            analysisType,
            jurisdiction
          );

          await tx.wait();

          toast({
            title: "Analysis Complete",
            description: `Your smart contract has been successfully analyzed and stored on-chain. Contract Analyzer Address: ${CONTRACT_ANALYZER_ADDRESS}`,
          });
        }
      }
    } catch (error: any) {
      console.error('Error analyzing contract:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze the smart contract. Please try again.",
        variant: "destructive",
      });
      setAnalyzedContractAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analysis,
    aiAnalysis,
    isLoading,
    analysisType,
    analyzedContractAddress,
    handleAnalyzeContract,
  };
};
