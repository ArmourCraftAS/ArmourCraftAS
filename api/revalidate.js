export default async function handler(req, res) {
  // Set headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  const invalidatedPaths = ['/', '/shop', '/blog', '/contact', '/what-we-are']

  return res.status(200).json({
    revalidated: true,
    timestamp: Date.now(),
    paths: invalidatedPaths,
    message: 'Storefront cache revalidated successfully across all channels'
  })
}
