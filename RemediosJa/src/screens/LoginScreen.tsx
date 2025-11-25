import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isPharmacy, setIsPharmacy] = useState(false); // Toggle Farmácia

  const handleLogin = () => {
    if (name.trim() === '' || email.trim() === '') {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    signIn(name, email, isPharmacy ? 'pharmacy' : 'client');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isPharmacy ? 'Área da Farmácia' : 'Bem-vindo!'}</Text>
      <Text style={styles.subtitle}>
        {isPharmacy ? 'Gerencie seus produtos e pedidos' : 'Entre para acessar seu perfil'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={isPharmacy ? "Nome da Farmácia" : "Seu Nome"}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="E-mail de acesso"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.switchContainer}>
        <Text>Sou Cliente</Text>
        <Switch value={isPharmacy} onValueChange={setIsPharmacy} />
        <Text>Sou Farmácia</Text>
      </View>

      <TouchableOpacity style={[styles.button, isPharmacy && styles.buttonPharmacy]} onPress={handleLogin}>
        <Text style={styles.buttonText}>{isPharmacy ? 'Acessar Painel' : 'Entrar'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10
  },
  button: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPharmacy: {
    backgroundColor: '#007bff', // Azul para farmácia
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});