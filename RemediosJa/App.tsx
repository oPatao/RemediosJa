import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './context/AuthContext'; // Importar useAuth
import { CartProvider } from './context/CartContext';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderConfirmedScreen from './src/screens/OrderConfirmedScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import PharmacyScreen from './src/screens/PharmacyScreen'; // Nova Tela

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Abas do Cliente
function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#28a745',
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'Buscar') iconName = 'search';
          if (route.name === 'Favoritos') iconName = 'heart'; // feather não tem hearto, usar AntDesign lá dentro se quiser
          if (route.name === 'Pedidos') iconName = 'file-text';
          if (route.name === 'Perfil') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Pedidos" component={OrdersScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Componente que decide qual fluxo mostrar
function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {/* Se for Farmácia, vai direto para o Painel */}
      {user?.type === 'pharmacy' ? (
        <Stack.Screen name="PharmacyDashboard" component={PharmacyScreen} options={{ headerShown: false }} />
      ) : (
        // Se for Cliente ou Deslogado, fluxo normal
        <>
          <Stack.Screen name="Main" component={ClientTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Meu Carrinho' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar pedido' }} />
          <Stack.Screen name="OrderConfirmed" component={OrderConfirmedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}