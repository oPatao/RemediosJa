import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCart } from '../../context/CartContext';

type RootStackParamList = {
  Checkout: undefined;
  Main: { screen: string };
};
type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

const CartItem = ({ item, updateQuantity, removeItem }: any) => (
  <View style={styles.itemCard}>
    <View style={styles.itemImagePlaceholder} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
    </View>
    <View style={styles.itemControls}>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Feather name="trash-2" size={20} color="gray" />
      </TouchableOpacity>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
          <Feather name="minus" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
          <Feather name="plus" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { cart, cartTotal, updateQuantity, removeItem } = useCart();
  
  const deliveryFee = 5.00;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const cartByPharmacy = cart.reduce((acc: any, item) => {
    (acc[item.pharmacy] = acc[item.pharmacy] || []).push(item);
    return acc;
  }, {});

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Feather name="shopping-cart" size={60} color="#ccc" />
        <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
        <Text style={styles.emptySubtitle}>Adicione produtos para começar seu pedido.</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Main', { screen: 'Início' } as any)}>
          <Text style={styles.emptyButtonText}>Ir para a Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {Object.entries(cartByPharmacy).map(([pharmacyName, items]: [string, any]) => (
            <View key={pharmacyName} style={styles.pharmacySection}>
                <Text style={styles.pharmacyName}>📍 {pharmacyName}</Text>
                {items.map((item: any) => (
                    <CartItem 
                        key={item.id} 
                        item={item} 
                        updateQuantity={updateQuantity} 
                        removeItem={removeItem} 
                    />
                ))}
            </View>
        ))}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo do pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Taxa de entrega</Text>
            <Text style={styles.summaryText}>R$ {deliveryFee.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotal}>R$ {cartTotal.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={() => navigation.navigate('Checkout' as any)}
        >
          <Text style={styles.checkoutButtonText}>Finalizar pedido (R$ {cartTotal.toFixed(2).replace('.', ',')})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Início' } as any)}>
          <Text style={styles.continueShopping}>Continuar comprando</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtitle: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '80%',
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pharmacySection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
  },
  pharmacyName: {
    fontWeight: 'bold',
    marginBottom: 15,
  },
  itemCard: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  itemControls: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryText: {
    color: 'gray',
  },
  summaryTotal: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  checkoutButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueShopping: {
    textAlign: 'center',
    color: '#1a1a1a',
    fontWeight: 'bold',
    marginTop: 15,
  },
});