export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Users, Bookmark, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // Defense-in-depth: Verify role inside Server Component
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

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
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin Portal
          </h1>
          <p className="text-gray-500 font-semibold text-sm mt-1">
            Manage BioLearn courses, publish fresh lessons, and monitor cohort enrollment progress.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white shadow-md shadow-blue-500/10 transition-all duration-200"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Create Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-gray-200 bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Learners</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{totalUsers || 0}</h3>
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Enrollments</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{totalEnrollments || 0}</h3>
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Published Courses</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{publishedCount}</h3>
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Draft Courses</p>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{draftCount}</h3>
          </div>
        </div>
      </div>

      {/* Courses Overview Table */}
      <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-sm text-gray-900">Syllabus Sandbox Catalog ({totalCourses})</h3>
        </div>
        
        {coursesList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Course Title</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coursesList.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50/40 transition">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {c.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded border shadow-sm ${
                        c.level === 'Beginner' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        c.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {c.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {c.estimated_hours}h
                    </td>
                    <td className="px-6 py-4">
                      {c.published ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 font-bold bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-700 font-bold bg-yellow-50 px-2.5 py-0.5 rounded-full border border-yellow-100">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/courses/${c.slug}`}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold transition"
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
          <div className="py-12 text-center text-gray-500 text-xs flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-gray-300" />
            <span>No courses generated yet. Click &quot;Create Course&quot; to initialize your first bioinformatics sandbox.</span>
          </div>
        )}
      </div>
    </div>
  );
}
