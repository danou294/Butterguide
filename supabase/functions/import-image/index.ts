import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'URL d\'image requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Fetching image from:', imageUrl)

    // Fetch the image from the provided URL
    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      console.error('Failed to fetch image:', imageResponse.status, imageResponse.statusText)
      return new Response(
        JSON.stringify({ error: 'Impossible de télécharger l\'image depuis l\'URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the image as a blob
    const imageBlob = await imageResponse.blob()
    console.log('Image blob size:', imageBlob.size, 'type:', imageBlob.type)
    
    // Extract filename from URL or generate one
    let fileName = 'imported-image.jpg'
    try {
      const urlParts = new URL(imageUrl)
      const pathParts = urlParts.pathname.split('/')
      const lastPart = pathParts[pathParts.length - 1]
      if (lastPart && lastPart.includes('.')) {
        fileName = decodeURIComponent(lastPart)
        // Clean the filename for Firebase URLs
        if (fileName.includes('?')) {
          fileName = fileName.split('?')[0]
        }
        // Remove any path separators
        fileName = fileName.replace(/.*[\/\\]/, '')
      }
    } catch (e) {
      console.warn('Could not extract filename from URL, using default')
    }

    console.log('Final filename:', fileName)

    // Convert blob to arrayBuffer and then to base64 safely
    const arrayBuffer = await imageBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Convert to base64 in chunks to avoid stack overflow
    let base64 = ''
    const chunkSize = 8192
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize)
      base64 += btoa(String.fromCharCode(...chunk))
    }
    
    return new Response(
      JSON.stringify({ 
        imageData: base64,
        fileName,
        contentType: imageBlob.type || 'image/jpeg'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

