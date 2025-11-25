import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDB, getUser, createUser } from '../service/database';

interface User {
  id: number;
  name: string;
  email: string;
  type: 'client' | 'pharmacy'; // Novo campo
  pedidos: number;
  economizou: number;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (name: string, email: string, type?: 'client' | 'pharmacy') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      await initDB();
      const storedUser = await AsyncStorage.getItem('@DrogariasApp:user_v2');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = async (name: string, email: string, type: 'client' | 'pharmacy' = 'client') => {
    try {
      const existingUser = await getUser(email);
      let userTyped;

      if (existingUser) {
        userTyped = existingUser as User;
        // Se o usuário existe mas estamos tentando logar com outro tipo, idealmente bloqueariamos, 
        // mas aqui vamos apenas logar com o tipo que ele já tem.
      } else {
        const newUser = await createUser(name, email, type);
        userTyped = newUser as User;
      }
      
      setUser(userTyped);
      await AsyncStorage.setItem('@DrogariasApp:user_v2', JSON.stringify(userTyped));
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@DrogariasApp:user_v2');
    setUser(null);
  };

  const authContextValue = useMemo(() => ({
    user, loading, signIn, logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);