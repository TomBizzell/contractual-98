
import { useState } from "react";
import { ContractInput } from "@/components/ContractInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeContract = async (address: string, network: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-contract', {
        body: {
          contract_address: address,
          network: network,
        },
      });

      if (error) throw error;

      if (data.source_code) {
        setAnalysis(data.source_code);
        toast({
          title: "Analysis Complete",
          description: "Your smart contract has been successfully analyzed.",
        });
      }
    } catch (error) {
      console.error('Error analyzing contract:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the smart contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dapp-primary mb-4">
            Smart Contract Analyzer
          </h1>
          <p className="text-dapp-accent text-lg max-w-2xl mx-auto">
            Enter your smart contract address and let AI explain its functionality in plain English
          </p>
        </div>

        <ContractInput onSubmit={handleAnalyzeContract} isLoading={isLoading} />
        <ResultsDisplay analysis={analysis} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
