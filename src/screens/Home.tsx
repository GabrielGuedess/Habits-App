import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Header } from 'components/Header';
import { HabitDay, daySize } from 'components/HabitDay';
import { Loading } from 'components/Loading';

import { generateRangeDatesFromYearStart } from 'utils/generate-range-between-dates';
import { api } from 'lib/axios';
import dayjs from 'dayjs';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = {
  id: string;
  date: Date;
  completed: number;
  amount: number;
};

export function Home() {
  const [summary, setSummary] = useState<SummaryProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { navigate } = useNavigation();

  async function getData() {
    try {
      const { data } = await api.get<SummaryProps[]>('/habits/summary');

      setSummary(data);
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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

        {summary && (
          <View className='flex-row flex-wrap'>
            {datesFromYearStart.map(date => {
              const dayWithHabits = summary.find(day =>
                dayjs(date).isSame(day.date, 'day')
              );

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amount={dayWithHabits?.amount}
                  completed={dayWithHabits?.completed}
                  onPress={() =>
                    navigate('Habit', { date: date.toISOString() })
                  }
                />
              );
            })}
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  key={index}
                  className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
                  style={{ width: daySize, height: daySize }}
                ></View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
