
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { textSlug, chapter, verse } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (textSlug && chapter && verse) {
      // Get specific verse
      const { data: verseData, error: verseError } = await supabaseClient
        .from('verses')
        .select(`
          *,
          texts:text_id (
            title,
            slug,
            category
          )
        `)
        .eq('texts.slug', textSlug)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .single()

      if (verseError) {
        throw verseError
      }

      return new Response(
        JSON.stringify({ verse: verseData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else if (textSlug) {
      // Get text with all verses
      const { data: textData, error: textError } = await supabaseClient
        .from('texts')
        .select(`
          *,
          verses (
            chapter,
            verse,
            sanskrit,
            transliteration,
            english_translation,
            hindi_translation,
            commentary
          )
        `)
        .eq('slug', textSlug)
        .single()

      if (textError) {
        throw textError
      }

      return new Response(
        JSON.stringify({ text: textData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Get all texts
      const { data: textsData, error: textsError } = await supabaseClient
        .from('texts')
        .select('*')
        .order('title')

      if (textsError) {
        throw textsError
      }

      return new Response(
        JSON.stringify({ texts: textsData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Text content error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
