interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  const clampedPercentage = Math.max(0, Math.min(100, Math.round(percentage)));

  return (
    <div className="w-full bg-gray-150 rounded-full h-2 overflow-hidden border border-gray-100">
      <div
        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
}
