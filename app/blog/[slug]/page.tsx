'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import BlogDetailPage from '../../../src/pages/BlogDetailPage'

export default function BlogDetail() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  return <BlogDetailPage slug={slug} onNavigate={(path) => router.push(path)} />
}
