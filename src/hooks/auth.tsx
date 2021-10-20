import React, {
  createContext,
  ReactNode,
  useContext
} from 'react';

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
}

function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    id: '1232313',
    name: 'Andre Costa',
    email: 'andre.costa101@gmail.com'
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }