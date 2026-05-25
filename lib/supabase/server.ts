import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Return a dummy proxy during build or static site generation phase if variables are missing
    return new Proxy({} as any, {
      get(target, prop) {
        if (prop === 'auth') {
          return new Proxy({}, {
            get(t, p) {
              if (p === 'getUser') {
                return () => Promise.resolve({ data: { user: null }, error: null });
              }
              return () => Promise.resolve({ data: {}, error: null });
            }
          });
        }
        return () => Promise.resolve({ data: null, error: null });
      }
    });
  }

  const cookieStore = cookies();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This can be ignored if called from Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: -1 });
          } catch (error) {
            // This can be ignored if called from Server Components
          }
        },
      },
    }
  );
}
