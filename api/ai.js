// api/ai.js — Vercel serverless function
// Ye browser ki jagah server se Anthropic API call karta hai
// CORS issue permanently fix ho jaata hai

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { messages, system, max_tokens = 500 } = req.body

  if (!messages) {
    res.status(400).json({ error: 'messages required' })
    return
  }

  const apiKey = process.env.ANTHROPIC_KEY  // no REACT_APP_ prefix on server
  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured on server' })
    return
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens,
        system,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      res.status(response.status).json({ error: data })
      return
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
