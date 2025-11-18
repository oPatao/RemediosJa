import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';  

const InfoBox = ({ value, label }: { value: string | number, label: string }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoValue}>{value}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
  </View>
);

// ... (Mantenha o componente ProfileOption igual ao anterior) ...
const ProfileOption = ({ icon, name, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionIcon}>{icon}</View>
      <View style={styles.optionText}>
        <Text style={styles.optionName}>{name}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="gray" />
    </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatarInitials}>
             <Text style={styles.avatarInitialsText}>{user.name?.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <InfoBox value={user.pedidos} label="Pedidos" />
          <InfoBox value={`R$ ${user.economizou.toFixed(2)}`} label="Economizou" />
          <InfoBox value={user.favoritos} label="Favoritos" />
        </View>
        
        {/* ... (Mantenha o restante do layout igual, chamando ProfileOption) ... */}
        <View style={styles.optionsContainer}>
           <ProfileOption 
                icon={<Feather name="map-pin" size={20} color="black" />} 
                name="Endereços" 
                subtitle="Gerenciar endereços de entrega"
            />
             <View style={styles.divider} />
             <ProfileOption 
                 icon={<Feather name="credit-card" size={20} color="black" />} 
                 name="Cartões e pagamento" 
                 subtitle="Métodos de pagamento salvos"
             />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ... (Mantenha os estilos iguais) ...
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'white',
    },
    avatarInitials: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitialsText: {
      fontSize: 24,
      color: '#888',
    },
    profileInfo: {
      flex: 1,
      marginLeft: 15,
    },
    profileName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    profileEmail: {
      color: 'gray',
    },
    editButton: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
    editButtonText: {
      color: '#333',
      fontWeight: 'bold',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
    },
    infoBox: {
      backgroundColor: 'white',
      width: '30%',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    infoValue: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    infoLabel: {
      color: 'gray',
      fontSize: 12,
      marginTop: 5,
    },
    optionsContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      marginHorizontal: 15,
      overflow: 'hidden',
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    optionText: {
      flex: 1,
    },
    optionName: {
      fontSize: 16,
    },
    optionSubtitle: {
      fontSize: 12,
      color: 'gray',
    },
    divider: {
      height: 1,
      backgroundColor: '#f0f0f0',
      marginLeft: 70,
    },
    logoutButton: {
      margin: 15,
      padding: 15,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: 'red',
      fontWeight: 'bold',
    }
});