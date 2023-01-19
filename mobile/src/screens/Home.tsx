import { Text, View, ScrollView } from 'react-native';

import { DAY_SIZE, HabitDay } from '../components/HabitDay';
import { Header } from '../components/Header';
import { generateDatesFromYearBegin } from '../utils/generate-dates-from-year-begin';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearBegin = generateDatesFromYearBegin();
const minimumSummaryDatesSizes = 10 * 7;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearBegin.length;

export function Home() {
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-white text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearBegin.map((date) => (
            <HabitDay key={date.toISOString()} />
          ))}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-60"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
