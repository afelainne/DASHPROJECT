import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import kv from '@/lib/kv'

export async function GET() {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      database: 'checking',
      cache: 'checking',
    },
    version: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  }

  try {
    // Test Supabase connection
    const { error: dbError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
      .single()

    healthCheck.services.database = dbError ? 'error' : 'healthy'

    // Test Vercel KV connection
    try {
      await kv.set('health-check', Date.now(), { ex: 10 })
      const kvResult = await kv.get('health-check')
      healthCheck.services.cache = kvResult ? 'healthy' : 'error'
    } catch (kvError) {
      healthCheck.services.cache = 'error'
    }

    // Determine overall status
    const allServicesHealthy = Object.values(healthCheck.services).every(
      status => status === 'healthy'
    )
    
    healthCheck.status = allServicesHealthy ? 'healthy' : 'degraded'

    return NextResponse.json(healthCheck, {
      status: allServicesHealthy ? 200 : 503
    })

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: 'Health check failed',
      services: {
        database: 'error',
        cache: 'error',
      }
    }, { status: 503 })
  }
}