import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default async function AdminGuard({ children }: AdminGuardProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
