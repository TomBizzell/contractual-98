
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getPromptForAnalysisType = (
  sourceCode: string,
  analysisType: string,
  jurisdiction?: string
) => {
  switch (analysisType) {
    case 'memorandum':
      return `Generate a formal memorandum of agreement that reflects this smart contract's terms and conditions. Consider the owners of the wallet addresses involved as the parties to the contract. Apply ${jurisdiction} jurisdiction and legal framework.

Key points to address:
1. Clearly identify the parties (wallet addresses as legal entities)
2. Define the terms and conditions as specified in the smart contract
3. Include relevant legal clauses and protections under ${jurisdiction} law
4. Specify enforcement mechanisms and dispute resolution procedures
5. Format as a proper legal document

Here's the smart contract source code to base the memorandum on:

${sourceCode}`;
    
    case 'general':
    default:
      return `Analyze this smart contract and explain in plain English what it does. Include its main functionality, any notable features, and potential use cases. Here's the source code:\n\n${sourceCode}`;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { source_code, contract_address, analysis_type, jurisdiction } = await req.json();
    
    const prompt = getPromptForAnalysisType(source_code, analysis_type, jurisdiction);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert at analyzing smart contracts and generating legal documents. Provide clear, detailed explanations and properly formatted documents based on the request type.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Store the analysis in the database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: updateError } = await supabase
      .from('contract_analyses')
      .update({ 
        ai_analysis: analysis,
        analysis_type,
        jurisdiction
      })
      .eq('contract_address', contract_address);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
