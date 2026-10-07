import { sendPasswordResetEmail } from '../../lib/emailService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {}
    } else if (!body) {
      body = {}
    }

    const { email, resetUrl } = body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' })
    }

    if (!resetUrl) {
      return res.status(400).json({ success: false, error: 'Reset URL is required.' })
    }

    // Print generated reset URL directly to server console for uninterrupted development & testing
    console.log('DEV RESET LINK:', resetUrl)

    const result = await sendPasswordResetEmail({
      to: email.trim(),
      resetUrl
    })

    return res.status(200).json(result)
  } catch (error) {
    console.error('Error in /api/admin/send-reset-email:', error)
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to dispatch email.'
    })
  }
}
