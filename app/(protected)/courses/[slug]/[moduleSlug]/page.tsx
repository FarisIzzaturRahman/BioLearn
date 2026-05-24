export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Lock, BookOpen, Play } from 'lucide-react';
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
  const currentModuleIndex = sortedModules.findIndex((m) => m.slug === moduleSlug);
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

  const completedModuleIds = completions?.map((c) => c.module_id) || [];
  const isCompleted = completedModuleIds.includes(currentModule.id);

  // Lock status calculation for all modules
  const modulesWithStatus = sortedModules.map((mod, idx) => {
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
        <div className="sticky top-20 border border-slate-800 bg-slate-900/50 rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-teal-400 transition mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Course Syllabus
            </Link>
            <h3 className="font-bold text-sm text-slate-200 line-clamp-1">{course.title}</h3>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {modulesWithStatus.map((mod, idx) => {
              const isActive = mod.slug === moduleSlug;
              
              let statusColor = 'text-slate-500 hover:text-slate-200 hover:bg-slate-850/50';
              if (isActive) {
                statusColor = 'text-teal-400 bg-slate-800/80 font-semibold border-l-2 border-teal-500 pl-2.5';
              } else if (mod.isCompleted) {
                statusColor = 'text-emerald-400 hover:bg-slate-850/30';
              } else if (!mod.isUnlocked) {
                statusColor = 'text-slate-600 cursor-not-allowed opacity-60';
              }

              return (
                <div key={mod.id}>
                  {mod.isUnlocked ? (
                    <Link
                      href={`/courses/${slug}/${mod.slug}`}
                      className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg transition-all ${statusColor}`}
                    >
                      {mod.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Play className="h-4 w-4 text-teal-400/70 fill-teal-400/5 flex-shrink-0" />
                      )}
                      <span className="truncate">
                        {idx + 1}. {mod.title}
                      </span>
                    </Link>
                  ) : (
                    <div className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg ${statusColor}`}>
                      <Lock className="h-4 w-4 text-slate-600 flex-shrink-0" />
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
      <main className="flex-grow min-w-0 border border-slate-800 bg-slate-900/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-12">
        
        {/* Markdown Content */}
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-850">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
              Module {currentModuleIndex + 1} of {sortedModules.length}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
              {currentModule.title}
            </h1>
          </div>

          <LessonContent content={currentModule.content_markdown || '# Content coming soon'} />
        </div>

        {/* BOTTOM NAV BAR */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous Module Link */}
          <div>
            {prevModule ? (
              <Link
                href={`/courses/${slug}/${prevModule.slug}`}
                className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition duration-300"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
                <span>Prev Lesson</span>
              </Link>
            ) : (
              <div className="w-10 sm:w-28" /> /* balance spacing */
            )}
          </div>

          {/* Mark Complete Action or Enrolled Trigger */}
          <div>
            {!isEnrolled ? (
              <div className="text-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                Enroll in course to track progress
              </div>
            ) : isCompleted ? (
              <span className="inline-flex items-center gap-1.5 py-2.5 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-extrabold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Lesson Completed!
              </span>
            ) : (
              <form action={completeModuleAction}>
                <button
                  type="submit"
                  className="py-2.5 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-teal-500/10 transition duration-300"
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
                  className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-850 hover:bg-teal-500 hover:text-slate-950 text-xs font-semibold text-slate-200 transition duration-300"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-950" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900/30 border border-slate-900 text-xs font-semibold text-slate-600 cursor-not-allowed">
                  <span>Locked</span>
                  <Lock className="h-3.5 w-3.5 text-slate-600" />
                </span>
              )
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/20 transition hover:bg-emerald-500 hover:text-slate-950"
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
