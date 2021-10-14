import React from 'react';
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
} from './styles';

import { Input } from '../../Components/Form/Input';
import { Button } from '../../Components/Form/Button';

export function Register() {
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input
            placeholder="Name"
          />
          <Input
            placeholder="Preço"
          />
        </Fields>
        <Button title='Enviar' />
      </Form>
    </Container>
  )
}