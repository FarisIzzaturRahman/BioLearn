export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, Clock, BarChart2, ShieldCheck, Flame } from 'lucide-react';
import ModuleList from '@/components/ModuleList';
import ProgressBar from '@/components/ProgressBar';
import { calculateProgress } from '@/lib/utils';

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 1. Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      modules (*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!course) {
    notFound();
  }

  // 2. Fetch user enrollment for this course
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single();

  const isEnrolled = !!enrollment;

  // 3. Fetch module completions for this user
  const { data: completions } = await supabase
    .from('module_completions')
    .select('module_id')
    .eq('user_id', user.id);

  const completedModuleIds = completions?.map((c: any) => c.module_id) || [];
  
  // Sort course modules
  const sortedModules = [...(course.modules || [])].sort((a: any, b: any) => a.order_index - b.order_index);
  
  // Calculate completed modules for this course
  const courseModuleIds = sortedModules.map((m: any) => m.id);
  const completedInCourse = completedModuleIds.filter((id: any) => courseModuleIds.includes(id));
  const progressPercentage = calculateProgress(completedInCourse.length, sortedModules.length);

  // Find the next incomplete module to direct user to
  const nextModule = sortedModules.find((m: any) => !completedModuleIds.includes(m.id)) || sortedModules[0];

  // Server Action to Enroll
  async function enrollAction() {
    'use server';
    const supabaseServer = createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) return;

    const { error } = await supabaseServer
      .from('enrollments')
      .insert({
        user_id: currentUser.id,
        course_id: course.id,
      });

    if (!error) {
      revalidatePath(`/courses/${slug}`);
    }
  }

  const getLevelColor = (level: string | null) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Back Button */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Curriculum Catalog
        </Link>
      </div>

      {/* Course Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cover & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
            {course.cover_image ? (
              <img
                src={course.cover_image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                <Flame className="w-12 h-12 text-blue-500/20 animate-pulse" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-600 font-bold bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {course.estimated_hours || 0} Hours Estimated
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-600 font-bold bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                <BarChart2 className="w-3.5 h-3.5 text-gray-400" />
                {sortedModules.length} Modules
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 leading-snug">{course.title}</h1>
            <p className="text-gray-500 font-semibold text-sm leading-relaxed max-w-3xl">
              {course.description || 'Welcome to this bio-computing sandbox. Follow the sequential lectures, inspect live biological databases, write processing tools in Python, and practice aligning files.'}
            </p>
          </div>
        </div>

        {/* Right Column: Enrollment Info Panel */}
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 space-y-6">
          <h3 className="font-bold text-base text-gray-900">Course Workspace</h3>

          {isEnrolled ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Your Study Progress</span>
                  <span className="text-blue-600 font-extrabold">{progressPercentage}%</span>
                </div>
                <ProgressBar percentage={progressPercentage} />
              </div>
              <div className="pt-2">
                <Link
                  href={`/courses/${course.slug}/${nextModule?.slug || ''}`}
                  className="block w-full text-center py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white shadow-md shadow-blue-500/10 transition-all duration-200"
                >
                  {progressPercentage === 100 ? 'Review Modules' : 'Continue Learning'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-xs text-gray-500 font-semibold leading-relaxed">
                Unlock all progressive course modules, track completed lessons, compile custom bio-pipelines, and sync progress on Vercel.
              </div>
              <form action={enrollAction}>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white shadow-md shadow-blue-500/10 transition-all duration-200"
                >
                  Enroll in Course
                </button>
              </form>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 space-y-2.5">
            <div className="flex gap-2 items-center text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Verified sandbox syllabus
            </div>
          </div>
        </div>
      </div>

      {/* Modules List Section */}
      <div className="pt-8 border-t border-gray-200 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Syllabus Lectures</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Complete each module to unlock the next sequence. Read explanations and test your sandbox commands.
          </p>
        </div>

        <ModuleList
          courseSlug={course.slug}
          modules={sortedModules}
          completedModuleIds={completedInCourse}
          enrolled={isEnrolled}
        />
      </div>
    </div>
  );
}
