
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const ETHERSCAN_API_KEY = Deno.env.get('ETHERSCAN_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ContractAnalysisRequest {
  contract_address: string
  network: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { contract_address, network } = await req.json() as ContractAnalysisRequest

    if (!ETHERSCAN_API_KEY) {
      throw new Error('Etherscan API key not configured')
    }

    const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contract_address}&apikey=${ETHERSCAN_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== "1") {
      throw new Error(`Etherscan API Error: ${data.message}`)
    }

    const result = data.result[0]
    let source_code = result.SourceCode

    // Handle potential multiple source files
    if (source_code.startsWith("{")) {
      try {
        const source_code_json = JSON.parse(source_code)
        source_code = Object.entries(source_code_json)
          .map(([filename, code]) => `File: ${filename}\n${code}`)
          .join('\n\n')
      } catch (error) {
        console.error('Error parsing multi-file source code JSON:', error)
      }
    }

    // Store the result in the database
    const { error: dbError } = await supabase
      .from('contract_analyses')
      .insert({
        contract_address,
        network,
        source_code,
      })

    if (dbError) {
      throw dbError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        source_code 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
