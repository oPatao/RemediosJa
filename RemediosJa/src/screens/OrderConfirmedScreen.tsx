import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
};
type OrderConfirmedNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function OrderConfirmedScreen() {
  const navigation = useNavigation<OrderConfirmedNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AntDesign name="check-circle" size={80} color="#28a745" />
        <Text style={styles.title}>Pedido Confirmado!</Text>
        <Text style={styles.subtitle}>Seu pedido foi realizado com sucesso e já está sendo preparado.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.popToTop()}>
          <Text style={styles.buttonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});