import Link from 'next/link';
import { BookOpen, Clock, BarChart } from 'lucide-react';
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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Advanced':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const hasProgress = progressPercentage !== null && progressPercentage !== undefined;

  return (
    <div className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-teal-500/40 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-lg hover:shadow-teal-500/5">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
        {course.cover_image ? (
          <img
            src={course.cover_image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-900/20 via-slate-900 to-emerald-900/20 flex items-center justify-center p-4">
            <BookOpen className="w-10 h-10 text-teal-500/40 group-hover:text-teal-400 transition-colors" />
          </div>
        )}
        
        {/* Level Badge */}
        {course.level && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-100 group-hover:text-teal-400 transition-colors duration-200 line-clamp-1">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {course.description || 'Dive into Bioinformatics concepts and master biological computations.'}
          </p>
        </div>

        {/* Stats and Progress */}
        <div className="mt-6 space-y-4">
          {hasProgress && enrolled && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Course Progress</span>
                <span className="text-teal-400 font-bold">{progressPercentage}%</span>
              </div>
              <ProgressBar percentage={progressPercentage} />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{course.estimated_hours || 0} Hours</span>
            </div>
            {enrolled && !hasProgress && (
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                Enrolled
              </span>
            )}
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="block w-full text-center py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-teal-500 hover:text-slate-950 font-semibold text-sm transition-all duration-300 text-slate-200"
          >
            {enrolled ? 'Continue Learning' : 'Explore Course'}
          </Link>
        </div>
      </div>
    </div>
  );
}
