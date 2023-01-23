import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  const isDateInPast = dayjs(date).endOf('day').isBefore(dayjs());

  async function getHabitsData() {
    const response = await api.get('day', {
      params: {
        date: date.toISOString(),
      },
    });

    setHabitsInfo(response.data);
  }

  async function handleToggleHabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`);

    const isHabitAlreadyChecked = habitsInfo!.completedHabits.includes(habitId);

    let completedHabits: string[] = [];

    if (isHabitAlreadyChecked) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    onCompletedChanged(completedHabits.length);
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
          defaultChecked={habitsInfo.completedHabits.includes(habit.id)}
          disabled={isDateInPast}
          onCheckedChange={() => handleToggleHabit(habit.id)}
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
