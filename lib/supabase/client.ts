import { createBrowserClient } from '@supabase/ssr';

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
              return () => Promise.resolve({ data: { user: null }, error: null });
            }
          });
        }
        return () => {};
      }
    });
  }

  return createBrowserClient(url, anonKey);
}
