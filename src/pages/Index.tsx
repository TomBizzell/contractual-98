
import { ContractInput } from "@/components/ContractInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { WalletConnector } from "@/components/WalletConnector";
import { ContractAddresses } from "@/components/ContractAddresses";
import { EmbedSection } from "@/components/EmbedSection";
import { useWeb3 } from "@/context/Web3Context";
import { useContractAnalysis } from "@/hooks/useContractAnalysis";
import { CONTRACT_ANALYZER_ADDRESS } from "@/contracts/ContractAnalyzer";

const Index = () => {
  const { provider, account, connect, isConnecting } = useWeb3();
  const {
    analysis,
    aiAnalysis,
    isLoading,
    analysisType,
    analyzedContractAddress,
    handleAnalyzeContract,
  } = useContractAnalysis(provider);

  const onAnalyzeContract = async (
    address: string,
    network: string,
    analysisType: string,
    jurisdiction: string
  ) => {
    await handleAnalyzeContract(address, network, analysisType, jurisdiction, account);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-dapp-primary">
            Smart Memorandum Generator
          </h1>
          <WalletConnector 
            account={account}
            isConnecting={isConnecting}
            onConnect={connect}
          />
        </div>

        <div className="space-y-2 text-center mb-12">
          <p className="text-dapp-accent text-lg max-w-2xl mx-auto">
            Turn your smart contract into an agreement memorandum, based on your jurisdiction
          </p>
          <p className="text-dapp-accent text-sm max-w-2xl mx-auto">
            An embeddable widget that uses Avalanche to save the generations to additional smart contracts and Flare to validate the etherscan source code queries for the targetted smart contracts
          </p>
        </div>

        {!account && (
          <div className="p-6 mb-8 text-center">
            <p className="text-dapp-accent mb-4">
              Please connect your wallet to analyze smart contracts
            </p>
            <WalletConnector 
              account={account}
              isConnecting={isConnecting}
              onConnect={connect}
            />
          </div>
        )}

        {account && (
          <>
            <ContractInput onSubmit={onAnalyzeContract} isLoading={isLoading} />
            
            {analyzedContractAddress && (
              <ContractAddresses 
                analyzedAddress={analyzedContractAddress}
                analyzerAddress={CONTRACT_ANALYZER_ADDRESS}
              />
            )}
            
            <ResultsDisplay 
              analysis={analysis} 
              aiAnalysis={aiAnalysis} 
              isLoading={isLoading}
              analysisType={analysisType}
            />
          </>
        )}

        <EmbedSection />
      </div>
    </div>
  );
};

export default Index;
