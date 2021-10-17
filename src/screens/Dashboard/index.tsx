import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../Components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../Components/TransactionCard';

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreetings,
  UserName,
  UserWrapper,
  Icon,
  HighlightCardsWrapper,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer,

} from './styles';
import { useFocusEffect } from '@react-navigation/core';
import theme from '../../global/styles/theme';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
}


export interface HighlightData {
  entries: HighLightProps,
  expenses: HighLightProps,
  total: HighLightProps,
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightData, setHighLightData] = useState<HighlightData>({} as HighlightData)

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;

    const formattedTransactions: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else if (item.type === 'negative') {
          expensesTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date))

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        }

      });

    setTransactions(formattedTransactions)

    const total = entriesTotal - expensesTotal;

    setHighLightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
      }
    });
    setLoading(false)
  }

  useEffect(() => {
    loadTransactions();
  }, [])

  useFocusEffect(useCallback(() => {


    loadTransactions();
  }, []));

  return (
    <Container>


      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator size={'large'} color={theme.colors.primary} />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo
                    source={{ uri: 'https://avatars.githubusercontent.com/u/48858873?v=4' }}
                  />
                  <User>
                    <UserGreetings>Olá, </UserGreetings>
                    <UserName>André</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={() => { }}>

                  <Icon name="power" />

                </LogoutButton>

              </UserWrapper>
            </Header>

            <HighlightCardsWrapper>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlightData.entries.amount}
                lastTransaction="Última entrada dia 13 de abril"
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={highlightData.expenses.amount}
                lastTransaction="Última entrada dia 03 de abril"
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData.total.amount}
                lastTransaction="01 à 16 de abril"
              />

            </HighlightCardsWrapper>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionsList
                data={transactions}
                inverted={true}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />

            </Transactions>
          </>
      }




    </Container>
  )
}