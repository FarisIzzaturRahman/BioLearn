import Link from 'next/link';
import { CheckCircle2, Lock, Play, Clock } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface Module {
  id: string;
  title: string;
  slug: string;
  duration_minutes: number | null;
  order_index: number;
}

interface ModuleListProps {
  courseSlug: string;
  modules: Module[];
  completedModuleIds?: string[];
  enrolled?: boolean;
}

export default function ModuleList({
  courseSlug,
  modules,
  completedModuleIds = [],
  enrolled = false,
}: ModuleListProps) {
  // Sort modules by order_index
  const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="space-y-3">
      {sortedModules.map((mod, index) => {
        const isCompleted = completedModuleIds.includes(mod.id);
        
        // Lock logic: locked if not enrolled.
        // Sequential progression lock: first module is always unlocked. 
        // Subsequent modules are unlocked if the previous one is completed.
        const isUnlocked = !enrolled 
          ? index === 0 // Allow preview of the first module even if not enrolled
          : index === 0 || completedModuleIds.includes(sortedModules[index - 1]?.id);

        const href = `/courses/${courseSlug}/${mod.slug}`;

        return (
          <div
            key={mod.id}
            className={`border rounded-lg p-4 transition-all duration-350 ${
              isUnlocked
                ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-teal-500/30'
                : 'border-slate-900 bg-slate-950/20 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Status Indicator Icon */}
                {isCompleted ? (
                  <div className="flex-shrink-0 text-emerald-400 p-1 bg-emerald-500/10 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                ) : !isUnlocked ? (
                  <div className="flex-shrink-0 text-slate-600 p-1 bg-slate-800/40 rounded-full">
                    <Lock className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 text-teal-400 p-1 bg-teal-500/10 rounded-full">
                    <Play className="h-5 w-5 fill-teal-400/20" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold font-mono">
                      Module {index + 1}
                    </span>
                    {mod.duration_minutes && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-slate-800/80 px-1.5 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {formatDuration(mod.duration_minutes)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 mt-1 truncate">
                    {mod.title}
                  </h4>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isUnlocked ? (
                  <Link
                    href={href}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-md shadow-teal-500/10'
                    }`}
                  >
                    {isCompleted ? 'Review' : 'Start'}
                  </Link>
                ) : (
                  <span className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800/30 text-slate-500 flex items-center gap-1 cursor-not-allowed">
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
