import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';

import { SocialSignInButton } from '../../Components/SocialSIgnInButton';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,

} from './styles';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      await signInWithGoogle()
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      Alert.alert('Algo deu errado')
      setIsLoading(false);
    }


  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      await signInWithApple()
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      Alert.alert('Algo deu errado')
      setIsLoading(false);
    }


  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo:
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SocialSignInButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
          <SocialSignInButton
            title="Entrar com Apple"
            svg={AppleSvg}
            onPress={handleSignInWithApple}
          />

        </FooterWrapper>

        {isLoading && <ActivityIndicator color={theme.colors.shape} size="large" />}
      </Footer>
    </Container>
  );
}

