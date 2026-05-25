export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Lock, Play } from 'lucide-react';
import LessonContent from '@/components/LessonContent';

interface ModuleDetailPageProps {
  params: {
    slug: string;
    moduleSlug: string;
  };
}

export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { slug, moduleSlug } = params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 1. Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!course) notFound();

  // 2. Fetch all modules of this course
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true });

  const sortedModules = modules || [];

  // 3. Find current module
  const currentModuleIndex = sortedModules.findIndex((m: any) => m.slug === moduleSlug);
  const currentModule = sortedModules[currentModuleIndex];

  if (!currentModule) notFound();

  // 4. Fetch user enrollment for this course
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single();

  const isEnrolled = !!enrollment;

  // 5. Fetch user completions for this course
  const { data: completions } = await supabase
    .from('module_completions')
    .select('module_id')
    .eq('user_id', user.id);

  const completedModuleIds = completions?.map((c: any) => c.module_id) || [];
  const isCompleted = completedModuleIds.includes(currentModule.id);

  // Lock status calculation for all modules
  const modulesWithStatus = sortedModules.map((mod: any, idx: number) => {
    const modCompleted = completedModuleIds.includes(mod.id);
    const modUnlocked = !isEnrolled
      ? idx === 0
      : idx === 0 || completedModuleIds.includes(sortedModules[idx - 1]?.id);

    return {
      ...mod,
      isCompleted: modCompleted,
      isUnlocked: modUnlocked,
    };
  });

  // Verify if user is trying to access a locked module
  const currentModuleStatus = modulesWithStatus[currentModuleIndex];
  if (!currentModuleStatus.isUnlocked) {
    // If not unlocked, redirect to course page
    redirect(`/courses/${slug}?locked=true`);
  }

  // Navigation handlers
  const prevModule = currentModuleIndex > 0 ? sortedModules[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex < sortedModules.length - 1 ? sortedModules[currentModuleIndex + 1] : null;
  
  // Check if next module is unlocked
  const isNextUnlocked = nextModule && (completedModuleIds.includes(currentModule.id) || !isEnrolled);

  // Server Action to Complete Module
  async function completeModuleAction() {
    'use server';
    const supabaseServer = createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) return;

    // Insert completion
    const { error } = await supabaseServer
      .from('module_completions')
      .insert({
        user_id: currentUser.id,
        module_id: currentModule.id,
      });

    if (!error) {
      revalidatePath(`/courses/${slug}/${moduleSlug}`);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4 relative">
      
      {/* LEFT COLUMN: Sidebar Modules List */}
      <aside className="w-full lg:w-80 flex-shrink-0 space-y-5">
        <div className="sticky top-20 border border-gray-200 bg-white rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="pb-3 border-b border-gray-100">
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Course Syllabus
            </Link>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{course.title}</h3>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {modulesWithStatus.map((mod: any, idx: number) => {
              const isActive = mod.slug === moduleSlug;
              
              let statusColor = 'text-gray-500 hover:text-gray-900 hover:bg-gray-50';
              if (isActive) {
                statusColor = 'text-blue-600 bg-blue-50/80 font-bold border-l-2 border-blue-600 pl-2.5';
              } else if (mod.isCompleted) {
                statusColor = 'text-emerald-700 hover:bg-emerald-50/30';
              } else if (!mod.isUnlocked) {
                statusColor = 'text-gray-300 cursor-not-allowed opacity-60';
              }

              return (
                <div key={mod.id}>
                  {mod.isUnlocked ? (
                    <Link
                      href={`/courses/${slug}/${mod.slug}`}
                      className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg transition-all ${statusColor}`}
                    >
                      {mod.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Play className="h-4 w-4 text-blue-500/70 fill-blue-500/5 flex-shrink-0" />
                      )}
                      <span className="truncate">
                        {idx + 1}. {mod.title}
                      </span>
                    </Link>
                  ) : (
                    <div className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg ${statusColor}`}>
                      <Lock className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      <span className="truncate">
                        {idx + 1}. {mod.title}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* RIGHT COLUMN: Lesson Area */}
      <main className="flex-grow min-w-0 border border-gray-200 bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-12 shadow-sm">
        
        {/* Markdown Content */}
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Module {currentModuleIndex + 1} of {sortedModules.length}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {currentModule.title}
            </h1>
          </div>

          <LessonContent content={currentModule.content_markdown || '# Content coming soon'} />
        </div>

        {/* BOTTOM NAV BAR */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous Module Link */}
          <div>
            {prevModule ? (
              <Link
                href={`/courses/${slug}/${prevModule.slug}`}
                className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 text-xs font-bold text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 text-gray-400" />
                <span>Prev Lesson</span>
              </Link>
            ) : (
              <div className="w-10 sm:w-28" /> /* balance spacing */
            )}
          </div>

          {/* Mark Complete Action or Enrolled Trigger */}
          <div>
            {!isEnrolled ? (
              <div className="text-center p-2 px-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold shadow-sm">
                Enroll in course to track progress
              </div>
            ) : isCompleted ? (
              <span className="inline-flex items-center gap-1.5 py-2.5 px-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Lesson Completed!
              </span>
            ) : (
              <form action={completeModuleAction}>
                <button
                  type="submit"
                  className="py-2.5 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 transition-all duration-200"
                >
                  Mark as Complete
                </button>
              </form>
            )}
          </div>

          {/* Next Module Link */}
          <div>
            {nextModule ? (
              isNextUnlocked ? (
                <Link
                  href={`/courses/${slug}/${nextModule.slug}`}
                  className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white text-xs font-bold text-blue-600 transition-all duration-200 shadow-sm"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="h-4 w-4 text-blue-500 group-hover:text-white" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-300 cursor-not-allowed">
                  <span>Locked</span>
                  <Lock className="h-3.5 w-3.5 text-gray-300" />
                </span>
              )
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-bold border border-emerald-200 shadow-sm transition-all duration-200"
              >
                Course Complete!
              </Link>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
