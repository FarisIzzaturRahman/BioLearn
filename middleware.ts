import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root landing page and auth callback do not require auth check
  const simplePublicRoutes = ['/', '/auth/callback'];
  if (simplePublicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Create response and supabase client
  let response = NextResponse.next();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Check session
  const { data: { user } } = await supabase.auth.getUser();

  // If already logged in and visiting login/register, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not logged in and visiting public login/register, allow access
  if (!user && (pathname === '/login' || pathname === '/register')) {
    return response;
  }

  // Redirect to login if user is not authenticated and trying to access protected paths
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin route protection
  if (pathname.startsWith('/admin')) {
    // Fetch profile role from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // If not admin, redirect to user dashboard
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
