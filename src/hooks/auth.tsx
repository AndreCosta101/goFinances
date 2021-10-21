import React, {
  createContext,
  ReactNode,
  useContext
} from 'react';

import * as AuthSession from 'expo-auth-session';

const AuthContext = createContext({} as IAuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    id: '1232313',
    name: 'Andre Costa',
    email: 'andre.costa101@gmail.com'
  }

  async function signInWithGoogle() {
    try {
      const CLIENT_ID = '514991381341-aomfddkinnr58gbchbbfl4bamcllfutq.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@andre.costa101/gofinances';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = await AuthSession
        .startAsync({ authUrl }) as AuthorizationResponse;
      console.log(type)
      if (type === 'success') {
        const response = await fetch(`https://googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        console.log(userInfo)
      }


    } catch (error: any) {
      throw new Error(error)
    }
  }


  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }