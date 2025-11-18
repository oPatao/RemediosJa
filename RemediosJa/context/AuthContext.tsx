import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDB, getUser, createUser } from '../service/database';

interface User {
  id: number;
  name: string;
  email: string;
  pedidos: number;
  economizou: number;
  favoritos: number;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      // 1. Inicializa o Banco
      await initDB();

      // 2. Verifica se já tem alguém logado no AsyncStorage
      const storedUser = await AsyncStorage.getItem('@DrogariasApp:user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = async (name: string, email: string) => {
    try {
      // Tenta buscar o usuário no banco
      const existingUser = await getUser(email);

      if (existingUser) {
        // Se existe, loga
        // CORREÇÃO AQUI: Forçamos o tipo para 'User'
        const userTyped = existingUser as User;
        
        setUser(userTyped);
        await AsyncStorage.setItem('@DrogariasApp:user', JSON.stringify(userTyped));
      } else {
        // Se não existe, cria um novo
        const newUser = await createUser(name, email);
        
        if (newUser) {
          const userTyped = newUser as User;
          
          setUser(userTyped);
          await AsyncStorage.setItem('@DrogariasApp:user', JSON.stringify(userTyped));
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@DrogariasApp:user');
    setUser(null);
  };

  const authContextValue = useMemo(() => ({
    user,
    loading,
    signIn,
    logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};