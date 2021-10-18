import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';
import { HistoryCard } from '../../Components/HistoryCard/index';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer
} from './styles';
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';

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
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  const theme = useTheme();

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const formattedData = response ? JSON.parse(response) : [];

    const totalByCategory: CategoryData[] = [];

    const expenses = formattedData
      .filter((expenses: TransactionData) => expenses.type === 'negative')

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
  }

  useEffect(() => {
    loadData();
  }, []);


  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>

      <Content>

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


    </Container>
  )
}