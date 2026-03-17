import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const languageNames: Record<string, string> = {
  en: 'English',
  ru: 'Russian',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  tr: 'Turkish',
  pt: 'Portuguese',
};

async function translateWithAI(content: string, langName: string): Promise<string> {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate all text fields in the given JSON to ${langName}. 
Return ONLY valid JSON with the exact same structure.
Keep proper nouns, brand names, model numbers, and prices as-is.
If text is already in ${langName}, return it unchanged.
Do not add any explanation or markdown.`,
        },
        { role: 'user', content },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || '';
  return rawText.replace(/```json\n?|\n?```/g, '').trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { targetLanguage } = body;
    const langName = languageNames[targetLanguage] || targetLanguage;

    // Batch mode: translate multiple listings at once
    if (body.listings && Array.isArray(body.listings)) {
      const items = body.listings.map((l: any) => ({
        id: l.id,
        title: l.title || '',
        description: l.description || '',
        city: l.city || '',
        country: l.country || '',
      }));

      if (items.length === 0) {
        return new Response(JSON.stringify({ translations: {} }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const cleaned = await translateWithAI(JSON.stringify(items), langName);
      const translated = JSON.parse(cleaned);

      // Convert array back to map by id
      const translationsMap: Record<string, any> = {};
      if (Array.isArray(translated)) {
        for (const item of translated) {
          translationsMap[item.id] = item;
        }
      }

      return new Response(JSON.stringify({ translations: translationsMap }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Single mode (backward compatible)
    const { title, description } = body;
    if (!title && !description) {
      return new Response(JSON.stringify({ error: 'No content to translate' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contentToTranslate = JSON.stringify({ title: title || '', description: description || '' });
    const cleaned = await translateWithAI(contentToTranslate, langName);
    const translated = JSON.parse(cleaned);

    return new Response(JSON.stringify(translated), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
