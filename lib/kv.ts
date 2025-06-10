import { kv } from '@vercel/kv'

export default kv

// Cache utilities
export const cache = {
  // Project cache
  setProject: async (userId: string, projectId: string, project: any) => {
    await kv.set(`project:${userId}:${projectId}`, JSON.stringify(project), { ex: 3600 })
  },
  
  getProject: async (userId: string, projectId: string) => {
    const cached = await kv.get(`project:${userId}:${projectId}`)
    return cached ? JSON.parse(cached as string) : null
  },

  // OFX temporary storage
  setOfxEntries: async (userId: string, entries: any[]) => {
    await kv.set(`ofx:${userId}`, JSON.stringify(entries), { ex: 7200 }) // 2 hours
  },

  getOfxEntries: async (userId: string) => {
    const cached = await kv.get(`ofx:${userId}`)
    return cached ? JSON.parse(cached as string) : null
  },

  // Financial dashboard cache
  setDashboard: async (userId: string, dashboard: any) => {
    await kv.set(`dashboard:${userId}`, JSON.stringify(dashboard), { ex: 900 }) // 15 minutes
  },

  getDashboard: async (userId: string) => {
    const cached = await kv.get(`dashboard:${userId}`)
    return cached ? JSON.parse(cached as string) : null
  },

  // Session cache
  setSession: async (sessionId: string, data: any) => {
    await kv.set(`session:${sessionId}`, JSON.stringify(data), { ex: 86400 }) // 24 hours
  },

  getSession: async (sessionId: string) => {
    const cached = await kv.get(`session:${sessionId}`)
    return cached ? JSON.parse(cached as string) : null
  },

  // Invalidate cache patterns
  invalidatePattern: async (pattern: string) => {
    // Note: Vercel KV doesn't support pattern deletion, so we'll track keys
    const keys = await kv.get(`keys:${pattern}`)
    if (keys) {
      const keyList = JSON.parse(keys as string)
      await Promise.all(keyList.map((key: string) => kv.del(key)))
      await kv.del(`keys:${pattern}`)
    }
  }
}