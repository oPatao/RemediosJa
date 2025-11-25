import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { getClientOrders, Order } from '../../service/database'; // Importação corrigida
import { useCart } from '../../context/CartContext';

type RootStackParamList = {
  Cart: undefined;
  Login: undefined;
  Home: undefined; // Adicionado para navegação
};
type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'entregue':
      return { container: '#e6f7eb', text: '#28a745', icon: <AntDesign name="check-circle" size={24} color="#28a745" /> };
    case 'enviado':
      return { container: '#e3f2fd', text: '#007bff', icon: <FontAwesome name="truck" size={24} color="#007bff" /> };
    case 'preparando':
      return { container: '#fff8e1', text: '#ffc107', icon: <MaterialCommunityIcons name="clock-time-three-outline" size={24} color="#ffc107" /> };
    default:
      return { container: '#f0f0f0', text: 'gray', icon: <Feather name="x-circle" size={24} color="gray" /> };
  }
};

const OrderCard = ({ order }: { order: Order }) => {
  const style = getStatusStyle(order.status);
  
  const totalItems = order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const dateFormatted = new Date(order.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const itemsSummary = order.items ? order.items.map(item => item.name).join(', ') : '';

  return (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderTitle}>
          {style.icon}
          <Text style={styles.orderId}> Pedido #{order.id.toString().padStart(6, '0')}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: style.container }]}>
          <Text style={[styles.statusText, { color: style.text }]}>{order.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.pharmacyName}>Farmácia: {order.pharmacy_name || 'Desconhecida'}</Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Data do pedido</Text>
        <Text style={styles.detailValue}>{dateFormatted}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total</Text>
        <Text style={styles.detailValue}>R$ {order.total.toFixed(2).replace('.', ',')}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Itens ({totalItems}):</Text>
        <Text style={styles.detailValue} numberOfLines={1}>{itemsSummary}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonOutlineText}>Ver detalhes</Text>
        </TouchableOpacity>
        {order.status === 'enviado' ? (
          <TouchableOpacity style={styles.buttonFilled}>
            <Text style={styles.buttonFilledText}>Rastrear</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonFilled}>
            <Text style={styles.buttonFilledText}>Comprar novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function OrdersScreen() {
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const { cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!user || !user.id) {
        setOrders([]);
        setLoading(false);
        return;
    }
    
    try {
        setLoading(true);
        // ATUALIZADO: Usa a nova função getClientOrders
        const userOrders = await getClientOrders(user.id);
        setOrders(userOrders);
    } catch (error) {
        console.error("Erro loadOrders", error);
        Alert.alert("Erro", "Não foi possível carregar seus pedidos.");
        setOrders([]);
    } finally {
        setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
        loadOrders();
    }, [loadOrders])
  );

  if (!user) {
    return (
      <View style={styles.emptyAuthContainer}>
        <Feather name="log-in" size={60} color="#ccc" />
        <Text style={styles.emptyTitle}>Acesso Restrito</Text>
        <Text style={styles.emptySubtitle}>Você precisa estar logado para ver seu histórico de pedidos.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTextSmall}>Entregar em</Text>
          <Text style={styles.headerTextLarge}>Esquina dos Fogos, 136 ▼</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color="black" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Feather name="user" size={24} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="gray" />
          <Text style={styles.searchInput}>Busque por medicamentos...</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 20 }}>
        {loading ? (
            <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 50 }} />
        ) : orders.length === 0 ? (
            <View style={styles.emptyState}>
                <MaterialCommunityIcons name="receipt-text-outline" size={60} color="#ccc" />
                <Text style={styles.emptyTitle}>Sem pedidos por aqui</Text>
                <Text style={styles.emptySubtitle}>Seu histórico de pedidos aparecerá aqui após sua primeira compra.</Text>
                {/* Correção da navegação para Home */}
                <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.emptyButtonText}>Começar a Comprar</Text>
                </TouchableOpacity>
            </View>
        ) : (
            orders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    flex: 1,
  },
  emptyAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  loginButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  headerTextSmall: {
    color: 'gray',
    fontSize: 12,
  },
  headerTextLarge: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
  },
  searchInput: {
    marginLeft: 10,
    color: 'gray',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  emptyButtonText: {
      color: 'white',
      fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptySubtitle: {
    color: 'gray',
    marginTop: 5,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pharmacyName: {
    color: 'gray',
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  detailLabel: {
    color: 'gray',
  },
  detailValue: {
    fontWeight: 'bold',
    maxWidth: '60%',
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingTop: 15,
  },
  buttonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonOutlineText: {
    fontWeight: 'bold',
  },
  buttonFilled: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonFilledText: {
    color: 'white',
    fontWeight: 'bold',
  },
});