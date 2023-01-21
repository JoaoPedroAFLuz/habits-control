import { View } from 'react-native';

interface ProgressBarProps {
  progress?: number;
}

export function ProgressBar({ progress = 0 }: ProgressBarProps) {
  return (
    <View className="w-full h-4 rounded-xl bg-zinc-700 mt-4">
      <View
        className="h-full rounded-xl bg-violet-600"
        style={{ width: `${progress}%` }}
      ></View>
    </View>
  );
}
