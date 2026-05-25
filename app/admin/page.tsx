export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';
import { PlusCircle, Users, Bookmark, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // 1. Fetch total users (profiles) count
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch total enrollments count
  const { count: totalEnrollments } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true });

  // 3. Fetch courses lists
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      slug,
      published,
      level,
      estimated_hours,
      created_at
    `)
    .order('created_at', { ascending: false });

  const coursesList = courses || [];
  const totalCourses = coursesList.length;
  const publishedCount = coursesList.filter((c: any) => c.published).length;
  const draftCount = totalCourses - publishedCount;

  return (
    <AdminGuard>
      <div className="space-y-8 py-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage BioLearn courses, publish fresh lessons, and monitor cohort enrollment progress.
            </p>
          </div>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 font-bold text-sm text-slate-950 shadow-md shadow-emerald-500/10 transition duration-300"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Create Course
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-slate-850 bg-slate-900/40 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Learners</p>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">{totalUsers || 0}</h3>
            </div>
          </div>

          <div className="border border-slate-850 bg-slate-900/40 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Enrollments</p>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">{totalEnrollments || 0}</h3>
            </div>
          </div>

          <div className="border border-slate-850 bg-slate-900/40 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Published Courses</p>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">{publishedCount}</h3>
            </div>
          </div>

          <div className="border border-slate-850 bg-slate-900/40 rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Draft Courses</p>
              <h3 className="text-xl font-bold text-slate-100 mt-0.5">{draftCount}</h3>
            </div>
          </div>
        </div>

        {/* Courses Overview Table */}
        <div className="border border-slate-800 bg-slate-900/20 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-850 bg-slate-900/40">
            <h3 className="font-bold text-sm text-slate-200">Syllabus Sandbox Catalog ({totalCourses})</h3>
          </div>
          
          {coursesList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/80 text-slate-500 font-bold border-b border-slate-850">
                  <tr>
                    <th className="px-6 py-3">Course Title</th>
                    <th className="px-6 py-3">Level</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {coursesList.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-900/30 transition">
                      <td className="px-6 py-4 font-semibold text-slate-200">
                        {c.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          c.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          c.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-violet-500/10 text-violet-400 border-violet-500/20'
                        }`}>
                          {c.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                        {c.estimated_hours}h
                      </td>
                      <td className="px-6 py-4">
                        {c.published ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/courses/${c.slug}`}
                          className="text-xs text-teal-400 hover:text-teal-300 font-semibold transition"
                        >
                          View Sandbox &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-slate-700" />
              <span>No courses generated yet. Click &quot;Create Course&quot; to initialize your first bioinformatics sandbox.</span>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
