import { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import { api } from '../lib/axios';
import { Loading } from '../components/Loading';

const availableWeekDays = [
  'Domingo',
  'Segunda-Feira',
  'Terça-Feira',
  'Quarta-Feria',
  'Quinta-Feira',
  'Sexta-Feira',
  'Sábado',
];

export function NewHabit() {
  const [isLoading, setIsLoading] = useState(false);
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState('');

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDayIndex)
      );
    } else {
      setWeekDays((prevState) => [...prevState, weekDayIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        return Alert.alert(
          'Novo hábito',
          'Insira o nome e a recorrência do hábito.'
        );
      }

      setIsLoading(true);

      await api.post('/habits', { title, weekDays });

      setTitle('');
      setWeekDays([]);
      setIsLoading(false);

      Alert.alert('Novo hábito', 'Hábito criado com sucesso.');
    } catch (error) {
      console.error(error);
      Alert.alert('Ops', 'Não foi possível criar o novo hábito.');
    }
  }

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

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white text-base font-semibold">
          Qual seu comprometimento?
        </Text>

        <TextInput
          placeholder="ex.: Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          className="h-12 pl-4 mt-3 rounded-lg bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="mt-4 mb-3 text-white text-base font-semibold">
          Qual a recorrência?
        </Text>

        {availableWeekDays.map((weekDay, index) => (
          <Checkbox
            key={weekDay}
            title={weekDay}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-14 flex-row items-center justify-center bg-green-600 mt-6 rounded-md"
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
