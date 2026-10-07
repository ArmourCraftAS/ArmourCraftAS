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

    // Print generated reset URL directly to server terminal/console for instant testing
    if (resetUrl) {
      console.log('RESET LINK:', resetUrl)
    }

    const result = await sendPasswordResetEmail({
      to: email.trim(),
      resetUrl: resetUrl || 'http://localhost:3000/admin/reset-password'
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in /api/admin/reset-password:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch email.' },
      { status: 500 }
    )
  }
}
