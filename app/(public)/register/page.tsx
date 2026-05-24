'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Dna, ShieldAlert, KeyRound, Mail, User, CheckCircle2, Loader2 } from 'lucide-react';
export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Client-side validations
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-teal-500/10 rounded-2xl text-teal-400 mb-3 shadow-lg shadow-teal-500/5">
            <Dna className="h-10 w-10 animate-float" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            BioLearn
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Learn Bioinformatics the CS Way. Sign up in seconds.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/5">
                <CheckCircle2 className="h-12 w-12 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Account Created Successfully!</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                Your sandbox access profile has been registered. Redirecting you to the login screen in 2 seconds...
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-100 text-center mb-6">
                Create Your Account
              </h3>

              {/* Error notifications */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2.5 items-start">
                  <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Registration Error</span>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Alan Turing"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500/60 transition"
                    />
                  </div>
                </div>

                {/* Email input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500/60 transition"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500/60 transition"
                    />
                  </div>
                </div>

                {/* Confirm Password input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirm Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="Retype password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500/60 transition"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4 shadow-md shadow-teal-500/10"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>

              {/* Toggle Form Link */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs">
                <span className="text-slate-500">Already have an account? </span>
                <Link href="/login" className="text-teal-400 hover:text-teal-300 font-semibold transition">
                  Login Here
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Home Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-teal-400 font-semibold transition">
            &larr; Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
