import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

import { useTheme } from 'styled-components';


import { HistoryCard } from '../../Components/HistoryCard/index';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from './styles';
import { categories } from '../../utils/categories';
import { useFocusEffect } from '@react-navigation/core';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/auth';

interface TransactionData {

  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  formattedTotal: string;
  color: string;
  percentage: string;
}

export function Report() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  const theme = useTheme();
  const { user } = useAuth();


  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true)
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const formattedData = response ? JSON.parse(response) : [];

    const totalByCategory: CategoryData[] = [];

    const expenses = formattedData
      .filter((expenses: TransactionData) =>
        expenses.type === 'negative' &&
        new Date(expenses.date).getMonth() === selectedDate.getMonth() &&
        new Date(expenses.date).getFullYear() === selectedDate.getFullYear()

      )

    const totalExpenses = expenses.reduce((acumullator: number, expenses: TransactionData) => {
      return acumullator + Number(expenses.amount);
    }, 0);



    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if (categorySum > 0) {
        const formattedTotal = categorySum
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })

        const percentage = `${(categorySum / totalExpenses * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          color: category.color,
          formattedTotal,
          percentage,
        })
      }

    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));


  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator size={'large'} color={theme.colors.primary} />
          </LoadContainer> :


          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >

            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')}>
                <MonthSelectIcon name="chevron-left" />
              </MonthSelectButton>

              <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

              <MonthSelectButton onPress={() => handleDateChange('next')}>
                <MonthSelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={80}
                x="percentage"
                y="total"
              />
            </ChartContainer>


            {
              totalByCategories.map(item => (
                <HistoryCard
                  key={item.key}
                  title={item.name}
                  amount={item.formattedTotal}
                  color={item.color}
                />
              ))

            }
          </Content>

      }
    </Container >



  )
}