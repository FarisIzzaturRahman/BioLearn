export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import CourseCard from '@/components/CourseCard';
import { BookOpen } from 'lucide-react';
import { calculateProgress } from '@/lib/utils';

export default async function CoursesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch all published courses
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      modules (id, duration_minutes)
    `)
    .eq('published', true)
    .order('created_at', { ascending: true });

  // 2. Fetch user enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', user.id);

  // 3. Fetch module completions
  const { data: completions } = await supabase
    .from('module_completions')
    .select('module_id')
    .eq('user_id', user.id);

  const enrolledCourseIds = enrollments?.map((e: any) => e.course_id) || [];
  const completedModuleIds = completions?.map((c: any) => c.module_id) || [];

  return (
    <div className="space-y-8 py-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Bioinformatics Curriculum
        </h1>
        <p className="text-gray-500 font-semibold text-sm mt-1">
          Explore our structured pathways. Build foundational genomics skills and program bio-algorithms.
        </p>
      </div>

      {/* Courses Grid */}
      {courses && courses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const courseModules = course.modules || [];
            const completedCount = courseModules.filter((m: any) => completedModuleIds.includes(m.id)).length;
            const progress = isEnrolled ? calculateProgress(completedCount, courseModules.length) : null;

            return (
              <CourseCard
                key={course.id}
                course={course}
                enrolled={isEnrolled}
                progressPercentage={progress}
              />
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 bg-white rounded-2xl p-16 text-center max-w-xl mx-auto flex flex-col items-center gap-3 shadow-sm">
          <BookOpen className="h-10 w-10 text-gray-400" />
          <h3 className="text-base font-bold text-gray-900">No courses published</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed font-semibold">
            The bioinformatics course catalog is currently being updated. Please check back shortly for fresh sandboxes!
          </p>
        </div>
      )}
    </div>
  );
}
