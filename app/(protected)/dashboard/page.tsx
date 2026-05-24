export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Award, Clock, ArrowRight, Layout } from 'lucide-react';
import { calculateProgress } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 2. Fetch all published courses
  const { data: allCourses } = await supabase
    .from('courses')
    .select(`
      *,
      modules (id, duration_minutes)
    `)
    .eq('published', true);

  // 3. Fetch user enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id);

  // 4. Fetch module completions
  const { data: completions } = await supabase
    .from('module_completions')
    .select('*')
    .eq('user_id', user.id);

  // Parse records
  const enrolledCourseIds = enrollments?.map((e) => e.course_id) || [];
  const completedModuleIds = completions?.map((c) => c.module_id) || [];
  const coursesList = allCourses || [];

  // Compute stats
  const totalEnrolled = enrolledCourseIds.length;
  const totalCompletions = completedModuleIds.length;
  
  // Calculate total hours learned: sum duration of completed modules
  let totalMinutesLearned = 0;
  coursesList.forEach(course => {
    course.modules.forEach((mod: any) => {
      if (completedModuleIds.includes(mod.id)) {
        totalMinutesLearned += mod.duration_minutes || 0;
      }
    });
  });
  const totalHoursLearned = Math.round(totalMinutesLearned / 60) || 0;

  // Classify courses
  const enrolledCoursesData = coursesList
    .filter((course) => enrolledCourseIds.includes(course.id))
    .map((course) => {
      const courseModules = course.modules || [];
      const courseCompleted = courseModules.filter((m: any) => completedModuleIds.includes(m.id)).length;
      const progress = calculateProgress(courseCompleted, courseModules.length);
      return {
        ...course,
        progress,
      };
    });

  const recommendedCourses = coursesList
    .filter((course) => !enrolledCourseIds.includes(course.id))
    .slice(0, 3); // show max 3 recommendations

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Explorer';

  return (
    <div className="space-y-10 py-6">
      
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 flex items-center gap-2">
            Welcome back, <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">{userName}</span>!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Let&apos;s translate more biology systems into software algorithms today.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 font-bold text-sm text-slate-950 shadow-md shadow-teal-500/10 transition duration-300"
        >
          Explore Courses
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border border-slate-850 bg-slate-900/40 rounded-2xl p-6 flex items-center gap-5">
          <div className="p-4 bg-teal-500/10 text-teal-400 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Enrolled Courses</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-0.5">{totalEnrolled}</h3>
          </div>
        </div>

        <div className="border border-slate-850 bg-slate-900/40 rounded-2xl p-6 flex items-center gap-5">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Modules Completed</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-0.5">{totalCompletions}</h3>
          </div>
        </div>

        <div className="border border-slate-850 bg-slate-900/40 rounded-2xl p-6 flex items-center gap-5">
          <div className="p-4 bg-violet-500/10 text-violet-400 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Estimated Hours Learned</p>
            <h3 className="text-2xl font-bold text-slate-100 mt-0.5">{totalHoursLearned}h</h3>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-slate-200 border-l-4 border-teal-500 pl-3">
          Continue Learning
        </h2>
        
        {enrolledCoursesData.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCoursesData.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                enrolled={true}
                progressPercentage={course.progress}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-slate-800 bg-slate-900/10 rounded-2xl p-10 text-center max-w-xl mx-auto flex flex-col items-center gap-4">
            <div className="p-3 bg-slate-850 rounded-full text-slate-500">
              <Layout className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200">No active enrollments</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                You haven&apos;t enrolled in any bioinformatics courses yet. Start your journey by checking our free curriculum!
              </p>
            </div>
            <Link
              href="/courses"
              className="py-2.5 px-6 rounded-lg bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-xs font-semibold transition duration-300 text-slate-300"
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Next Section */}
      {recommendedCourses.length > 0 && (
        <div className="space-y-5 pt-4">
          <h2 className="text-xl font-bold text-slate-200 border-l-4 border-emerald-500 pl-3">
            Recommended Next
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} enrolled={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
