import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin-auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    await requireUser()

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'فایلی انتخاب نشده است' },
        { status: 400 }
      )
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue // Skip non-image files
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue // Skip oversized files
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'projects')
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (e) {
        // Directory might already exist
      }

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/\s+/g, '-')}`
      const filepath = join(uploadDir, filename)

      // Save file
      await writeFile(filepath, buffer)

      // Add public URL
      uploadedUrls.push(`/uploads/projects/${filename}`)
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'هیچ تصویر معتبری آپلود نشد' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls
    })

  } catch (error) {
    console.error('Error uploading project images:', error)
    return NextResponse.json(
      { error: 'خطا در اپلود فایل‌ها' },
      { status: 500 }
    )
  }
}
