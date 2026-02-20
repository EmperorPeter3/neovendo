import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, targetLanguage } = await req.json();

    if (!title && !description) {
      return new Response(JSON.stringify({ error: 'No content to translate' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      ru: 'Russian',
      de: 'German',
      fr: 'French',
      es: 'Spanish',
      it: 'Italian',
      tr: 'Turkish',
    };

    const langName = languageNames[targetLanguage] || targetLanguage;

    const contentToTranslate = JSON.stringify({ title: title || '', description: description || '' });

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
            content: `You are a professional translator. Translate the given JSON object's "title" and "description" fields to ${langName}. 
Return ONLY valid JSON with the same structure: {"title": "...", "description": "..."}.
Keep proper nouns, brand names, model numbers, and prices as-is.
If the text is already in ${langName}, return it unchanged.
Do not add any explanation or markdown.`,
          },
          {
            role: 'user',
            content: contentToTranslate,
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';

    // Strip markdown code blocks if present
    const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
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
