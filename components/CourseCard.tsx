import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    level: string | null; // 'Beginner' | 'Intermediate' | 'Advanced'
    estimated_hours: number | null;
  };
  progressPercentage?: number | null;
  enrolled?: boolean;
}

export default function CourseCard({ course, progressPercentage = null, enrolled = false }: CourseCardProps) {
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

  const hasProgress = progressPercentage !== null && progressPercentage !== undefined;

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 border-b border-gray-100">
        {course.cover_image ? (
          <img
            src={course.cover_image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <BookOpen className="w-10 h-10 text-blue-500/30 group-hover:text-blue-500/50 transition-colors" />
          </div>
        )}
        
        {/* Level Badge */}
        {course.level && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {course.description || 'Dive into Bioinformatics concepts and master biological computations.'}
          </p>
        </div>

        {/* Stats and Progress */}
        <div className="mt-6 space-y-4">
          {hasProgress && enrolled && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Course Progress</span>
                <span className="text-blue-600 font-bold">{progressPercentage}%</span>
              </div>
              <ProgressBar percentage={progressPercentage} />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{course.estimated_hours || 0} Hours</span>
            </div>
            {enrolled && !hasProgress && (
              <span className="text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                Enrolled
              </span>
            )}
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="block w-full text-center py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all duration-200"
          >
            {enrolled ? 'Continue Learning' : 'Explore Course'}
          </Link>
        </div>
      </div>
    </div>
  );
}
