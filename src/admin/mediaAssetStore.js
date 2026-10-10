/**
 * mediaAssetStore.js
 * Persistent Client-Side Media Asset Storage for ARMOURCRAFT AS
 * 
 * Uses IndexedDB to store binary video/image files without localStorage quota limitations.
 * Manages Object URLs and re-hydrates asset references across sessions.
 */

const DB_NAME = 'armourcraft_media_store'
const DB_VERSION = 1
const STORE_NAME = 'assets'

// In-memory active object URLs cache
const memoryAssetMap = new Map()

/**
 * Open IndexedDB connection
 */
function openDB() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }

      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (err) => {
        console.warn('IndexedDB open warning:', err)
        resolve(null)
      }
    } catch (e) {
      console.warn('IndexedDB initialization exception:', e)
      resolve(null)
    }
  })
}

/**
 * Save a File or Blob to IndexedDB and register an active Object URL
 * @param {File|Blob} file 
 * @param {string} [customId] 
 * @returns {Promise<{ id: string, objectUrl: string, name: string, size: number, type: string }>}
 */
export async function saveMediaAsset(file, customId = null) {
  if (!file) throw new Error('No file provided')

  const id = customId || `asset_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  const name = file.name || 'uploaded_video.mp4'
  const size = file.size || 0
  const type = file.type || 'video/mp4'

  // 1. Create immediate live Object URL
  let objectUrl = ''
  if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
    objectUrl = window.URL.createObjectURL(file)
  }

  // 2. Cache in memory
  memoryAssetMap.set(id, {
    id,
    blob: file,
    objectUrl,
    name,
    size,
    type,
    updatedAt: Date.now()
  })

  // 3. Persist to IndexedDB
  try {
    const db = await openDB()
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const record = {
          id,
          name,
          size,
          type,
          blob: file,
          savedAt: Date.now()
        }
        const putReq = store.put(record)
        putReq.onsuccess = () => resolve(true)
        putReq.onerror = (err) => reject(err)
      })
    }
  } catch (dbErr) {
    console.warn('Could not persist media asset to IndexedDB:', dbErr)
  }

  return {
    id,
    objectUrl,
    name,
    size,
    type
  }
}

/**
 * Retrieve an asset by ID and ensure it has an active Object URL
 * @param {string} id 
 * @returns {Promise<{ id: string, objectUrl: string, name: string, blob: Blob }|null>}
 */
export async function getMediaAsset(id) {
  if (!id) return null

  // Check memory cache first
  if (memoryAssetMap.has(id)) {
    const cached = memoryAssetMap.get(id)
    if (cached.objectUrl) return cached
    // Re-create object url if missing
    if (cached.blob && typeof window !== 'undefined') {
      cached.objectUrl = window.URL.createObjectURL(cached.blob)
      return cached
    }
  }

  // Check IndexedDB
  try {
    const db = await openDB()
    if (!db) return null

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(id)

      req.onsuccess = () => {
        const result = req.result
        if (result && result.blob) {
          const objectUrl = typeof window !== 'undefined' ? window.URL.createObjectURL(result.blob) : ''
          const item = {
            id: result.id,
            name: result.name,
            size: result.size,
            type: result.type,
            blob: result.blob,
            objectUrl
          }
          memoryAssetMap.set(id, item)
          resolve(item)
        } else {
          resolve(null)
        }
      }

      req.onerror = () => resolve(null)
    })
  } catch (e) {
    console.warn('Error reading media asset from IndexedDB:', e)
    return null
  }
}

/**
 * Check if a URL is an internal blob or asset reference and re-hydrate if needed
 */
export async function rehydrateVideoAsset(videoAssetId, fallbackSrc = '') {
  if (!videoAssetId) return fallbackSrc
  const asset = await getMediaAsset(videoAssetId)
  if (asset && asset.objectUrl) {
    return asset.objectUrl
  }
  return fallbackSrc
}
