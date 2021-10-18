import React from 'react';

import { HistoryCard } from '../../Components/HistoryCard/index';
import {
  Container,
  Header,
  Title,
} from './styles';

export function Report() {
  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>

      <HistoryCard
        title="Compras"
        amount="R$ 150,50"
        color="red"
      />
    </Container>
  )
}