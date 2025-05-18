import { Progress } from "@/components/ui/progress";

interface GoalProgressProps {
  title: string;
  progress: number;
  currentValue?: string | number;
  targetValue?: string | number;
  dueDate?: string;
  isOngoing?: boolean;
}

export function GoalProgress({
  title,
  progress,
  currentValue,
  targetValue,
  dueDate,
  isOngoing = false
}: GoalProgressProps) {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress >= 75) return "bg-success";
    if (progress >= 50) return "bg-primary";
    if (progress >= 25) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <h3 className="text-sm font-medium text-neutral-800">{title}</h3>
        <span className="text-sm text-neutral-500">{progress}%</span>
      </div>
      <div className="w-full bg-neutral-100 rounded-full h-2">
        <div 
          className={`${getProgressColor()} h-2 rounded-full`} 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-neutral-500">
        {currentValue && targetValue ? (
          <>
            <span>Current: {currentValue}</span>
            <span>Target: {targetValue}</span>
          </>
        ) : isOngoing ? (
          <>
            <span>Ongoing</span>
            <span>{dueDate || "No due date"}</span>
          </>
        ) : (
          <>
            <span>{isOngoing ? "Ongoing" : "Q4 Goal"}</span>
            <span>{dueDate ? `Due: ${dueDate}` : "No due date"}</span>
          </>
        )}
      </div>
    </div>
  );
}
