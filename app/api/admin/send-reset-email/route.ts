import { NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '../../../../lib/emailService'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, resetUrl } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required.' },
        { status: 400 }
      )
    }

    if (!resetUrl) {
      return NextResponse.json(
        { success: false, error: 'Reset URL is required.' },
        { status: 400 }
      )
    }

    // Print generated reset URL directly to server console for uninterrupted development & testing
    console.log('DEV RESET LINK:', resetUrl)

    const result = await sendPasswordResetEmail({
      to: email.trim(),
      resetUrl
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in /api/admin/send-reset-email:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch email.' },
      { status: 500 }
    )
  }
}
