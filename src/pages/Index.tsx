
import { useState } from "react";
import { ContractInput } from "@/components/ContractInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Wallet } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";
import { ethers } from "ethers";
import { CONTRACT_ANALYZER_ABI, CONTRACT_ANALYZER_ADDRESS } from "@/contracts/ContractAnalyzer";

const AVALANCHE_CHAIN_ID = '0xa86a'; // 43114 in hex

const Index = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState("general");
  const [analyzedContractAddress, setAnalyzedContractAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const { provider, account, connect, isConnecting } = useWeb3();

  const ensureAvalancheNetwork = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== AVALANCHE_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: AVALANCHE_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: AVALANCHE_CHAIN_ID,
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
    jurisdiction: string
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
      // Ensure we're on Avalanche network
      await ensureAvalancheNetwork();

      // First, get the source code
      const { data: sourceData, error: sourceError } = await supabase.functions.invoke('analyze-contract', {
        body: {
          contract_address: address,
          network: network,
        },
      });

      if (sourceError) throw sourceError;

      if (sourceData.source_code) {
        setAnalysis(sourceData.source_code);
        
        // Then, get the AI analysis
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
          
          // Store the analysis on-chain and show contract address
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

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied!",
      description: "Embed code has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-dapp-primary">
            Smart Contract Analyzer
          </h1>
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="flex items-center gap-2"
            variant={account ? "outline" : "default"}
          >
            <Wallet className="h-4 w-4" />
            {account 
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : isConnecting 
                ? "Connecting..."
                : "Connect Wallet"
            }
          </Button>
        </div>

        <p className="text-dapp-accent text-lg max-w-2xl mx-auto mb-12">
          Enter your smart contract address and let AI explain its functionality in plain English
        </p>

        {!account && (
          <Card className="p-6 mb-8 text-center">
            <p className="text-dapp-accent mb-4">
              Please connect your wallet to analyze smart contracts
            </p>
            <Button onClick={connect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </Card>
        )}

        {account && (
          <>
            <ContractInput onSubmit={handleAnalyzeContract} isLoading={isLoading} />
            
            {analyzedContractAddress && (
              <Card className="mt-4 p-4 bg-green-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-800">Contract Address:</p>
                    <p className="text-sm text-green-600">{analyzedContractAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Analyzer Contract:</p>
                    <p className="text-sm text-green-600">{CONTRACT_ANALYZER_ADDRESS}</p>
                  </div>
                </div>
              </Card>
            )}
            
            <ResultsDisplay 
              analysis={analysis} 
              aiAnalysis={aiAnalysis} 
              isLoading={isLoading}
              analysisType={analysisType}
            />
          </>
        )}

        <Card className="mt-8 p-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-dapp-primary">
              Embed this analyzer in your website
            </h2>
            <p className="text-dapp-accent">
              Copy the code below to embed the contract analyzer in your website:
            </p>
            <div className="flex items-center gap-4">
              <code className="flex-1 p-4 bg-gray-100 rounded-lg overflow-x-auto">
                &lt;iframe src="{window.location.origin}/embed" width="100%" height="600" frameborder="0"&gt;&lt;/iframe&gt;
              </code>
              <Button variant="outline" size="icon" onClick={copyEmbedCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
