import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  OrderConfirmed: undefined;
};
type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderConfirmed'>;

const PaymentOption = ({ icon, title, subtitle, selected, onPress }: any) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <FontAwesome5 name={selected ? 'dot-circle' : 'circle'} size={20} color={selected ? 'black' : 'gray'} />
    <MaterialIcons name={icon} size={24} color="black" style={{ marginHorizontal: 15 }} />
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function CheckoutScreen() {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const navigation = useNavigation<CheckoutScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Endereço de entrega</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Casa</Text>
              <TouchableOpacity>
                <Text style={styles.changeLink}>Alterar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>Esquina dos Fogos De Artifício, 136</Text>
            <Text style={styles.cardText}>Jardim Paulista, São Paulo - SP</Text>
            <Text style={styles.cardText}>CEP: 01310-100</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complemento (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Apto, bloco, referência..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 Tempo de entrega</Text>
          <View style={[styles.card, styles.cardRow]}>
            <Text style={styles.cardTitle}>Entrega padrão</Text>
            <Text style={styles.cardTitle}>R$ 5,00</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Forma de pagamento</Text>
          <View style={styles.card}>
            <PaymentOption
              icon="credit-card"
              title="Cartão de Crédito"
              subtitle="Visa, Master, Elo"
              selected={paymentMethod === 'credit'}
              onPress={() => setPaymentMethod('credit')}
            />
            <View style={styles.divider} />
            <PaymentOption
              icon="payment"
              title="Cartão de Débito"
              subtitle="Visa, Master, Elo"
              selected={paymentMethod === 'debit'}
              onPress={() => setPaymentMethod('debit')}
            />
            <View style={styles.divider} />
            <PaymentOption
              icon="qr-code"
              title="PIX"
              subtitle="Pagamento instantâneo"
              selected={paymentMethod === 'pix'}
              onPress={() => setPaymentMethod('pix')}
            />
            <View style={styles.divider} />
            <PaymentOption
              icon="account-balance-wallet"
              title="Dinheiro"
              subtitle="Pagar na entrega"
              selected={paymentMethod === 'cash'}
              onPress={() => setPaymentMethod('cash')}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('OrderConfirmed')}>
          <Text style={styles.checkoutButtonText}>Finalizar pedido</Text>
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
  section: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  changeLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  cardText: {
    color: 'gray',
    marginTop: 2,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
  },
  optionSubtitle: {
    fontSize: 12,
    color: 'gray',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
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
});