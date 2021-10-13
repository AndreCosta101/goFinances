import React from 'react';
import { HighlightCard } from '../../Components/HighlightCard';
import { TransactionCard } from '../../Components/TransactionCard';
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
} from './styles';


export function Dashboard() {
  return (
    <Container>
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
          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCardsWrapper>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última entrada dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
        />

      </HighlightCardsWrapper>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionCard />
      </Transactions>




    </Container>
  )
}