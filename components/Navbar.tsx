'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Dna, LogOut, LayoutDashboard, BookOpen, Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  user: any;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
    email?: string;
  };
}

export default function Navbar({ user, profile }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Courses', icon: BookOpen },
  ];

  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400 group-hover:bg-teal-500/20 transition-all duration-300">
                <Dna className="h-6 w-6 animate-float" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                BioLearn
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 px-3 rounded-lg ${
                    isActive
                      ? 'text-teal-400 bg-slate-800/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 px-3 rounded-lg ${
                  pathname.startsWith('/admin')
                    ? 'text-emerald-400 bg-slate-800/50'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          {/* User Profile / Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-slate-850 transition"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="h-8 w-8 rounded-full border-2 border-teal-500/50 hover:border-teal-400 transition"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-teal-500/10 border-2 border-teal-500/50 flex items-center justify-center text-teal-400 font-bold text-sm">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-300 hover:text-slate-100 transition max-w-[120px] truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-500 truncate">{profile?.email || user.email}</p>
                    <p className="text-xs font-semibold text-teal-400 capitalize mt-0.5">{profile?.role || 'Student'}</p>
                  </div>
                  
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition"
                    >
                      <Shield className="h-4 w-4 text-emerald-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'text-teal-400 bg-slate-800/80'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
          
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                pathname.startsWith('/admin')
                  ? 'text-emerald-400 bg-slate-800/80'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'
              }`}
            >
              <Shield className="h-5 w-5" />
              Admin
            </Link>
          )}

          <div className="pt-4 mt-4 border-t border-slate-800 px-3">
            <div className="flex items-center gap-3 mb-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  className="h-9 w-9 rounded-full border border-teal-500"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-teal-500/10 border border-teal-500/50 flex items-center justify-center text-teal-400 font-bold text-sm">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-200">{profile?.full_name || user.email?.split('@')[0]}</p>
                <p className="text-xs text-slate-500 truncate">{profile?.email || user.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
