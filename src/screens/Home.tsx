import React from 'react';
import { ScrollView, View } from 'react-native';

import { Header } from 'components/Header';
import { HabitDay, daySize } from 'components/HabitDay';
import { Text } from 'react-native';
import { generateRangeDatesFromYearStart } from 'utils/generate-range-between-dates';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

export function Home() {
  return (
    <View className='bg-background flex-1 px-8 pt-16'>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className='flex-row mt-6 mb-2'>
          {weekDays.map((weekDay, index) => (
            <Text
              className='text-zinc-400 text-xl font-bold text-center mx-1'
              style={{ width: daySize }}
              key={`${weekDay}-${index}`}
            >
              {weekDay}
            </Text>
          ))}
        </View>

        <View className='flex-row flex-wrap'>
          {datesFromYearStart.map(date => (
            <HabitDay key={date.toISOString()} />
          ))}
          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
                style={{ width: daySize, height: daySize }}
              ></View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
