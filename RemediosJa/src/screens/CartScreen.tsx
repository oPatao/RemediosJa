import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Checkout: undefined;
};
type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

const CartItem = ({ name, price, quantity }: { name: string, price: string, quantity: number }) => (
  <View style={styles.itemCard}>
    <View style={styles.itemImagePlaceholder} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemPrice}>R$ {price}</Text>
    </View>
    <View style={styles.itemControls}>
      <TouchableOpacity>
        <Feather name="trash-2" size={20} color="gray" />
      </TouchableOpacity>
      <View style={styles.quantityControl}>
        <TouchableOpacity>
          <Feather name="minus" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity>
          <Feather name="plus" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.pharmacySection}>
          <Text style={styles.pharmacyName}>📍 Farmácia São Paulo</Text>
          <CartItem name="Dipirona 500mg" price="8.90" quantity={2} />
          <CartItem name="Vitamina C 1g" price="15.50" quantity={1} />
        </View>

        <View style={styles.pharmacySection}>
          <Text style={styles.pharmacyName}>📍 Drogaria Ultra Popular</Text>
          <CartItem name="Protetor Solar FPS 50" price="45.90" quantity={1} />
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo do pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>R$ 79.20</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Taxa de entrega</Text>
            <Text style={styles.summaryText}>R$ 5.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotal}>R$ 84.20</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutButtonText}>Finalizar pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity>
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