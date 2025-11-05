import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Cart: undefined;
};
type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Entregue':
      return { container: '#e6f7eb', text: '#28a745', icon: <AntDesign name="check-circle" size={24} color="#28a745" /> };
    case 'A caminho':
      return { container: '#e3f2fd', text: '#007bff', icon: <FontAwesome name="truck" size={24} color="#007bff" /> };
    case 'Preparando':
      return { container: '#fff8e1', text: '#ffc107', icon: <MaterialCommunityIcons name="clock-time-three-outline" size={24} color="#ffc107" /> };
    default:
      return { container: '#f0f0f0', text: 'gray' };
  }
};

const OrderCard = ({ id, pharmacy, status, date, total, items }: any) => {
  const style = getStatusStyle(status);
  return (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderTitle}>
          {style.icon}
          <Text style={styles.orderId}> Pedido #{id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: style.container }]}>
          <Text style={[styles.statusText, { color: style.text }]}>{status}</Text>
        </View>
      </View>
      <Text style={styles.pharmacyName}>{pharmacy}</Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Data do pedido</Text>
        <Text style={styles.detailValue}>{date}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Total</Text>
        <Text style={styles.detailValue}>R$ {total}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Itens do pedido:</Text>
        <Text style={styles.detailValue}>{items}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonOutlineText}>Ver detalhes</Text>
        </TouchableOpacity>
        {status === 'A caminho' ? (
          <TouchableOpacity style={styles.buttonFilled}>
            <Text style={styles.buttonFilledText}>Rastrear pedido</Text>
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
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* --- CABEÇALHO (Igual ao da Home) --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTextSmall}>Entregar em</Text>
          <Text style={styles.headerTextLarge}>Esquina dos Fogos De Artificio, 136 ▼</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color="black" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <Feather name="user" size={24} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      {/* --- BARRA DE BUSCA (Igual ao da Home) --- */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="gray" />
          <Text style={styles.searchInput}>Busque por medicamentos, vitaminas...</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll}>
        {/* <View style={styles.emptyState}>
          <MaterialCommunityIcons name="receipt-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>Seus Pedidos</Text>
          <Text style={styles.emptySubtitle}>Acompanhe o status dos seus pedidos</Text>
        </View> */}
        
        <OrderCard
          id="PED001"
          pharmacy="Farmácia Popular"
          status="Entregue"
          date="Hoje, 14:30"
          total="45.80"
          items="Paracetamol 500mg, Vitamina C 1g"
        />
        <OrderCard
          id="PED002"
          pharmacy="Drogaria São Paulo"
          status="A caminho"
          date="Hoje, 16:45"
          total="28.90"
          items="Dipirona 500mg, Protetor solar"
        />
        <OrderCard
          id="PED003"
          pharmacy="Farmácia Pacheco"
          status="Preparando"
          date="Hoje, 17:10"
          total="75.20"
          items="Remédio X, Remédio Y"
        />
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
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptySubtitle: {
    color: 'gray',
    marginTop: 5,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    margin: 15,
    marginBottom: 0,
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