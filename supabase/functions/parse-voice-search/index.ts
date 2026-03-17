import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a search query parser for a classifieds marketplace. Given a user's voice description of what they want to find, extract structured search parameters.

Available categories: transport, realEstate, jobs, services, personalItems, homeAndGarden, autoParts, electronics, hobbies, animals, business

Available subcategories for transport: cars, motorcycles, mopeds, atvs, quads, snowmobiles, karting
Available subcategories for realEstate: apartments, houses, rooms, commercial, land, garages

Extract these fields:
- query: the main search text (what they're looking for, cleaned up)
- category: one of the available categories if mentioned or implied
- subcategory: one of the available subcategories if mentioned or implied
- minPrice: minimum price if mentioned (number only)
- maxPrice: maximum price if mentioned (number only)

Return ONLY a valid JSON object with these fields. Omit fields that weren't mentioned.
The user speaks in ${language} language.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: transcript },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_search_params",
              description: "Extract structured search parameters from voice input",
              parameters: {
                type: "object",
                properties: {
                  query: { type: "string", description: "Main search text" },
                  category: { type: "string", enum: ["transport", "realEstate", "jobs", "services", "personalItems", "homeAndGarden", "autoParts", "electronics", "hobbies", "animals", "business"] },
                  subcategory: { type: "string" },
                  minPrice: { type: "number" },
                  maxPrice: { type: "number" },
                },
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_search_params" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      // Fallback: return transcript as query
      return new Response(JSON.stringify({ query: transcript }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let result: Record<string, unknown> = { query: transcript };
    if (toolCall?.function?.arguments) {
      try {
        result = JSON.parse(toolCall.function.arguments);
      } catch {
        // fallback
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("parse-voice-search error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
