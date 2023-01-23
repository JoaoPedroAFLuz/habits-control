import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
  date: Date;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function HabitsList({ date }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  async function getHabitsData() {
    const response = await api.get('day', {
      params: {
        date: date.toISOString(),
      },
    });

    setHabitsInfo(response.data);
    console.log('🚀 ~ response', response.data);
  }

  useEffect(() => {
    getHabitsData();
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => (
        <Checkbox.Root
          key={habit.id}
          className="flex items-center gap-3 group"
          checked={habitsInfo.completedHabits.includes(habit.id)}
        >
          <div className="h-8 w-8 flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 rounded-lg group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
            <Checkbox.Indicator>
              <Check size={20} className="text-white" />
            </Checkbox.Indicator>
          </div>

          <span className="font-semibold text-xl text-white leading-tight">
            {habit.title}
          </span>
        </Checkbox.Root>
      ))}
    </div>
  );
}
