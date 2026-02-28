const IMGBB_ENDPOINT = 'https://api.imgbb.com/1/upload'

function getImgBBApiKey() {
  const viteKey = import.meta?.env?.VITE_IMGBB_API_KEY
  const craKey = typeof process !== 'undefined' ? process?.env?.REACT_APP_IMGBB_API_KEY : undefined
  const key = String(viteKey || craKey || '').trim()

  if (!key) {
    throw new Error('Missing ImgBB API key. Set VITE_IMGBB_API_KEY (Vite) or REACT_APP_IMGBB_API_KEY (CRA).')
  }

  return key
}

async function parseImgBBError(res, json) {
  const statusText = res?.status ? `HTTP ${res.status}` : 'Request failed'
  const msg = json?.error?.message || json?.message || statusText
  return msg
}

export async function uploadImage(file) {
  if (!file) throw new Error('Missing file')

  const apiKey = getImgBBApiKey()
  const fd = new FormData()
  fd.append('key', apiKey)
  fd.append('image', file)

  let res
  let json
  try {
    res = await fetch(IMGBB_ENDPOINT, {
      method: 'POST',
      body: fd,
    })

    json = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(await parseImgBBError(res, json))
    }

    const url = json?.data?.url
    if (!url) {
      throw new Error('ImgBB upload succeeded but no URL returned')
    }

    return url
  } catch (err) {
    const msg = err?.message || 'Failed to upload image'
    throw new Error(msg)
  }
}

export async function uploadImages(files, { limit = 5, onProgress } = {}) {
  const list = Array.from(files || []).filter(Boolean)
  if (!list.length) return []
  if (list.length > limit) throw new Error(`You can upload maximum ${limit} images`)

  const urls = []
  for (let i = 0; i < list.length; i++) {
    if (typeof onProgress === 'function') {
      onProgress({ index: i, total: list.length })
    }
    // Sequential uploads are more stable and avoid hitting rate limits.
    // If you want maximum speed, we can switch this to Promise.all.
    const url = await uploadImage(list[i])
    urls.push(url)
  }

  if (typeof onProgress === 'function') {
    onProgress({ index: list.length, total: list.length })
  }

  return urls
}
