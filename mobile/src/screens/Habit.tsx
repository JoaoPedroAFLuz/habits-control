import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { api } from '../lib/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';

import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import { Loading } from '../components/Loading';
import { ProgressBar } from '../components/ProgressBar';
interface Params {
  date: string;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function Habit() {
  const [isLoading, setIsLoading] = useState(true);
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo | null>();

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitProgress = habitsInfo?.possibleHabits
    ? generateProgressPercentage(
        habitsInfo.possibleHabits.length,
        habitsInfo.completedHabits.length
      )
    : 0;

  async function getHabitsInfo() {
    try {
      setIsLoading(true);

      const response = await api.get('day', {
        params: {
          date: dayjs(date).toISOString(),
        },
      });

      setHabitsInfo(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Ops',
        'Não foi possível carregar as informações dos hábitos.'
      );
    } finally {
      setIsLoading(false);
    }
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

    // onCompletedChanged(completedHabits.length);
  }

  useEffect(() => {
    getHabitsInfo();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-black px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 text-base font-semibold lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitProgress} />

        <View className="mt-6">
          {habitsInfo?.possibleHabits.map((habit) => (
            <Checkbox
              key={habit.id}
              title={habit.title}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              onPress={() => handleToggleHabit(habit.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
