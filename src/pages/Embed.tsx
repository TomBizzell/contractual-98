
import { useState } from "react";
import { ContractInput } from "@/components/ContractInput";
import { EmbedResultsDisplay } from "@/components/EmbedResultsDisplay";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Embed = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState("memorandum");
  const { toast } = useToast();

  const handleAnalyzeContract = async (
    address: string,
    network: string,
    analysisType: string,
    jurisdiction: string
  ) => {
    setIsLoading(true);
    setAnalysisType(analysisType);
    try {
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
        }

        // Create iframe session
        await supabase.from('iframe_sessions').insert({
          contract_address: address,
          network: network,
          analysis_type: analysisType,
          jurisdiction: jurisdiction
        });

        toast({
          title: "Analysis Complete",
          description: "Your memorandum is ready for download.",
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-4">
        {!analysis ? (
          <button
            onClick={() => document.getElementById('contract-form')?.classList.remove('hidden')}
            className="w-full py-2 px-4 bg-dapp-highlight text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Produce Memorandum
          </button>
        ) : null}
        
        <div id="contract-form" className="hidden mt-4">
          <ContractInput 
            onSubmit={handleAnalyzeContract} 
            isLoading={isLoading}
            defaultAnalysisType="memorandum"
          />
        </div>

        <EmbedResultsDisplay
          aiAnalysis={aiAnalysis}
          isLoading={isLoading}
          analysisType={analysisType}
        />
      </div>
    </div>
  );
};

export default Embed;
