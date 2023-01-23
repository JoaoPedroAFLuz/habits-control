import * as Progress from '@radix-ui/react-progress';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <Progress.Root className="w-full mt-4 h-3 rounded-xl bg-zinc-700">
      <Progress.Indicator
        className="h-full rounded-xl bg-violet-600 transition-all"
        style={{ width: `${progress}%` }}
      />
    </Progress.Root>
  );
}
