import React from 'react';
import {
  Container,
  Header,
  Title,
  Form,
} from './styles';

import { Input } from '../../Components/Form/Input';

export function Register() {
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Input
          placeholder="Name"
        />
        <Input
          placeholder="Preço"
        />
      </Form>
    </Container>
  )
}