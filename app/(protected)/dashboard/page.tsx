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
  const enrolledCourseIds = enrollments?.map((e: any) => e.course_id) || [];
  const completedModuleIds = completions?.map((c: any) => c.module_id) || [];
  const coursesList = allCourses || [];

  // Compute stats
  const totalEnrolled = enrolledCourseIds.length;
  const totalCompletions = completedModuleIds.length;
  
  // Calculate total hours learned: sum duration of completed modules
  let totalMinutesLearned = 0;
  coursesList.forEach((course: any) => {
    course.modules.forEach((mod: any) => {
      if (completedModuleIds.includes(mod.id)) {
        totalMinutesLearned += mod.duration_minutes || 0;
      }
    });
  });
  const totalHoursLearned = Math.round(totalMinutesLearned / 60) || 0;

  // Classify courses
  const enrolledCoursesData = coursesList
    .filter((course: any) => enrolledCourseIds.includes(course.id))
    .map((course: any) => {
      const courseModules = course.modules || [];
      const courseCompleted = courseModules.filter((m: any) => completedModuleIds.includes(m.id)).length;
      const progress = calculateProgress(courseCompleted, courseModules.length);
      return {
        ...course,
        progress,
      };
    });

  const recommendedCourses = coursesList
    .filter((course: any) => !enrolledCourseIds.includes(course.id))
    .slice(0, 3); // show max 3 recommendations

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Explorer';

  return (
    <div className="space-y-10 py-6">
      
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{userName}</span>!
          </h1>
          <p className="text-gray-500 font-semibold text-sm mt-1">
            Let&apos;s translate more biology systems into software algorithms today.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white shadow-md shadow-blue-500/10 transition-all duration-200"
        >
          Explore Courses
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border border-gray-200 bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Enrolled Courses</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{totalEnrolled}</h3>
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Modules Completed</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{totalCompletions}</h3>
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Hours Learned</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{totalHoursLearned}h</h3>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">
          Continue Learning
        </h2>
        
        {enrolledCoursesData.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCoursesData.map((course: any) => (
              <CourseCard
                key={course.id}
                course={course}
                enrolled={true}
                progressPercentage={course.progress}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 bg-white rounded-2xl p-10 text-center max-w-xl mx-auto flex flex-col items-center gap-4 shadow-sm">
            <div className="p-3 bg-gray-50 rounded-full text-gray-400">
              <Layout className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">No active enrollments</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed font-semibold">
                You haven&apos;t enrolled in any bioinformatics courses yet. Start your journey by checking our free curriculum!
              </p>
            </div>
            <Link
              href="/courses"
              className="py-2.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold transition duration-200 text-white shadow-sm"
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Next Section */}
      {recommendedCourses.length > 0 && (
        <div className="space-y-5 pt-4">
          <h2 className="text-xl font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">
            Recommended Next
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} enrolled={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
