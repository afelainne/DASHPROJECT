import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cache } from '@/lib/kv'
import { captureError, trackPerformance } from '@/lib/monitoring'

export async function POST(request: NextRequest) {
  return trackPerformance('upload-ofx', async () => {
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File
      const userId = formData.get('userId') as string
      
      if (!file || !userId) {
        return NextResponse.json(
          { error: 'File and userId are required' },
          { status: 400 }
        )
      }

      // Upload file to Supabase Storage
      const fileName = `ofx/${userId}/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ofx-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        captureError(uploadError, { userId, fileName })
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        )
      }

      // Parse OFX content (simplified parsing)
      const fileContent = await file.text()
      const entries = parseOfxContent(fileContent)

      // Store parsed entries in Vercel KV (temporary)
      await cache.setOfxEntries(userId, entries)

      // Save import record to Supabase
      const { data: importRecord, error: dbError } = await supabase
        .from('ofx_imports')
        .insert({
          user_id: userId,
          filename: file.name,
          file_path: uploadData.path,
          entries_count: entries.length
        })
        .select()
        .single()

      if (dbError) {
        captureError(dbError, { userId, fileName })
        return NextResponse.json(
          { error: 'Failed to save import record' },
          { status: 500 }
        )
      }

      console.log('OFX file uploaded and parsed:', {
        userId,
        fileName: file.name,
        entriesCount: entries.length,
        importId: importRecord.id
      })

      return NextResponse.json({
        importId: importRecord.id,
        entries,
        entriesCount: entries.length
      })

    } catch (error) {
      captureError(error as Error, { endpoint: 'upload-ofx' })
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}

function parseOfxContent(content: string) {
  const entries = []
  const transactions = content.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/g) || []
  
  for (const transaction of transactions) {
    const amount = transaction.match(/<TRNAMT>(.*?)</)?.[1]
    const date = transaction.match(/<DTPOSTED>(.*?)</)?.[1]
    const memo = transaction.match(/<MEMO>(.*?)</)?.[1]
    const fitid = transaction.match(/<FITID>(.*?)</)?.[1]
    
    if (amount && date && memo) {
      entries.push({
        id: fitid || `temp-${Date.now()}-${Math.random()}`,
        amount: parseFloat(amount),
        date: formatOfxDate(date),
        description: memo.trim(),
        status: 'pending'
      })
    }
  }
  
  return entries
}

function formatOfxDate(ofxDate: string): string {
  // Convert YYYYMMDDHHMMSS to YYYY-MM-DD
  const year = ofxDate.substring(0, 4)
  const month = ofxDate.substring(4, 6)
  const day = ofxDate.substring(6, 8)
  return `${year}-${month}-${day}`
}