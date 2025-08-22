import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieStore = await cookies();
          try {
            cookieStore.set({ name, value, ...options });
          } catch { // Corrected: removed 'error'
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
          }
        },
        async remove(name: string, options: CookieOptions) {
          const cookieStore = await cookies();
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch { // Corrected: removed 'error'
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
          }
        },
      },
    }
  )
}