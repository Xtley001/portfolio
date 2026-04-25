import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/session'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    return NextResponse.json({ error: 'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in your environment.' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: jpg, png, webp, gif` }, { status: 400 })
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
  }

  const cloudForm = new FormData()
  cloudForm.append('file', file)
  cloudForm.append('upload_preset', uploadPreset)
  cloudForm.append('folder', 'portfolio/projects')

  let res: Response
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cloudForm,
    })
  } catch (fetchError) {
    return NextResponse.json({ error: 'Failed to reach Cloudinary. Check your network.' }, { status: 502 })
  }

  if (!res.ok) {
    let errorMessage = `Cloudinary error (${res.status})`
    try {
      const errJson = await res.json()
      errorMessage = errJson?.error?.message || errorMessage
    } catch {
      try {
        const errText = await res.text()
        errorMessage = errText || errorMessage
      } catch {}
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }

  let data: { secure_url?: string; public_id?: string }
  try {
    data = await res.json()
  } catch {
    return NextResponse.json({ error: 'Cloudinary returned invalid JSON' }, { status: 500 })
  }

  if (!data.secure_url) {
    return NextResponse.json({ error: 'Cloudinary did not return a URL. Check upload preset configuration.' }, { status: 500 })
  }

  return NextResponse.json({ url: data.secure_url, publicId: data.public_id })
}
