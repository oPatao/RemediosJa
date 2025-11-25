import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getFavorites, toggleFavorite } from '../../service/database';

type RootStackParamList = {
  Cart: undefined;
  Login: undefined;
  Home: undefined;
};
type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Product {
    id: number;
    name: string;
    category: string;
    pharmacy: string;
    pharmacy_id?: number;
    pharmacy_name?: string;
    price: number;
    oldPrice?: number;
    image?: string;
}

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { user } = useAuth();
  const { addItem } = useCart();
  
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    const data = await getFavorites(user.id);
    const formatted = data.map((item: any) => ({
        ...item,
        pharmacy: item.pharmacy_name || 'Farmácia Desconhecida'
    }));
    setFavorites(formatted);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
        loadFavorites();
    }, [loadFavorites])
  );

  const handleRemoveFavorite = async (id: number) => {
      if (!user) return;
      await toggleFavorite(user.id, id);
      loadFavorites(); 
  };

  const handleAddToCart = (item: Product) => {
    addItem({ 
      id: item.id, 
      name: item.name, 
      pharmacy: item.pharmacy, 
      price: item.price,
      pharmacy_id: item.pharmacy_id
    });
  };

  if (!user) {
    return (
      <View style={styles.emptyAuthContainer}>
        <Feather name="heart" size={60} color="#ccc" />
        <Text style={styles.emptyTitle}>Guarde seus favoritos</Text>
        <Text style={styles.emptySubtitle}>Faça login para salvar medicamentos e produtos.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.imagePlaceholder}>
         {item.image ? (
           <Image source={{ uri: item.image }} style={styles.productImage} />
         ) : (
           <Feather name="image" size={24} color="#ccc" />
         )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPharmacy}>{item.pharmacy}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.priceRow}>
            <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>
      
      <View style={styles.actionsColumn}>
        <TouchableOpacity style={styles.favButton} onPress={() => handleRemoveFavorite(item.id)}>
            <FontAwesome name="trash" size={20} color="#dc3545" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 20 }} />
      ) : favorites.length === 0 ? (
        <View style={styles.emptyState}>
             <Feather name="heart" size={50} color="#ccc" />
             <Text style={styles.emptyText}>Você ainda não tem favoritos.</Text>
             <TouchableOpacity style={styles.goHomeButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.goHomeText}>Explorar Produtos</Text>
             </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 1
  },
  imagePlaceholder: {
      width: 60,
      height: 60,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPharmacy: {
    fontSize: 12,
    color: 'gray',
  },
  productCategory: {
      fontSize: 10,
      color: '#28a745',
      backgroundColor: '#e6f7eb',
      alignSelf: 'flex-start',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginTop: 4,
      overflow: 'hidden'
  },
  priceRow: {
      marginTop: 5
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  actionsColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70
  },
  favButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: '#1a1a1a',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
  loginButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '80%',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: 'gray',
    marginTop: 10,
    marginBottom: 20
  },
  goHomeButton: {
      borderWidth: 1,
      borderColor: '#28a745',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20
  },
  goHomeText: {
      color: '#28a745',
      fontWeight: 'bold'
  }
});