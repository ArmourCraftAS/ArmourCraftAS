import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/shop')
    revalidatePath('/blog')
    revalidatePath('/contact')
    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      paths: ['/', '/shop', '/blog', '/contact'],
      message: 'Storefront cache revalidated successfully'
    })
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, error: err?.message || 'Revalidation failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}
