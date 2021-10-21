import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}


export interface HighlightData {
  income: HighLightProps,
  expenses: HighLightProps,
  total: HighLightProps,
}

function getLastTransactionDate(
  collection: DataListProps[],
  type: 'positive' | 'negative') {
  const lastTransaction = new Date(
    Math.max.apply(Math, collection
      // pega as transações de mesmo tipo
      .filter((transaction) => transaction.type === type)
      //separa apenas as datas e transforma elas de string para formato de data.
      .map((transaction) => new Date(transaction.date).getTime()))
  )


  return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightData, setHighLightData] = useState<HighlightData>({} as HighlightData)

  const { signOut, user } = useAuth();

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let incomeTotal = 0;
    let expensesTotal = 0;

    const formattedTransactions: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if (item.type === 'positive') {
          incomeTotal += Number(item.amount);
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

    const lastIncomeTransaction = getLastTransactionDate(transactions, 'positive')
    const lastExpenseTransaction = getLastTransactionDate(transactions, 'positive')
    const totalInterval = `01 a ${new Date().getDate()} de ${new Date().toLocaleString('pt-BR', { month: 'long' })} `;


    const total = incomeTotal - expensesTotal;

    setHighLightData({
      income: {
        amount: incomeTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastIncomeTransaction} `,
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastExpenseTransaction} `,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });
    setIsLoading(false)
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
                    source={{ uri: user.photo }}
                  />
                  <User>
                    <UserGreetings>Olá, </UserGreetings>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={signOut}>

                  <Icon name="power" />

                </LogoutButton>

              </UserWrapper>
            </Header>

            <HighlightCardsWrapper>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlightData.income.amount}
                lastTransaction={highlightData.income.lastTransaction}
              />
              <HighlightCard
                type="down"
                title="Saídas"
                amount={highlightData.expenses.amount}
                lastTransaction={highlightData.expenses.lastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData.total.amount}
                lastTransaction={highlightData.total.lastTransaction}
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