import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { searchProducts, toggleFavorite } from '../../service/database';
import FilterBottomSheet from '../../components/FilterBottomSheet';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

type RootStackParamList = {
  Cart: undefined;
};
type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

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
    isFavorite?: boolean;
}

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { addItem, cart } = useCart();
  const { user } = useAuth();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(0);

  const fetchProducts = async () => {
    setLoading(true);
    const results = await searchProducts(searchText, filterCategory, filterMaxPrice, user?.id);
    
    const formattedResults = results.map((item: any) => ({
      ...item,
      pharmacy: item.pharmacy_name || 'Farmácia Desconhecida',
      pharmacy_id: item.pharmacy_id
    }));

    setProducts(formattedResults);
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText, filterCategory, filterMaxPrice]);

  const handleApplyFilters = (cat: string | null, price: number) => {
      setFilterCategory(cat);
      setFilterMaxPrice(price);
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

  const handleToggleFavorite = async (item: Product) => {
    if (!user) return Alert.alert("Login", "Faça login para favoritar.");
    
    await toggleFavorite(user.id, item.id);
    
    setProducts(current => current.map(p => 
        p.id === item.id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

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
            {item.oldPrice && (
                <Text style={styles.productOldPrice}>R$ {item.oldPrice.toFixed(2).replace('.', ',')}</Text>
            )}
        </View>
      </View>
      
      <View style={styles.actionsColumn}>
        <TouchableOpacity style={styles.favButton} onPress={() => handleToggleFavorite(item)}>
            <FontAwesome name={item.isFavorite ? "heart" : "heart-o"} size={20} color={item.isFavorite ? "#dc3545" : "gray"} />
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

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="gray" />
          <TextInput
            style={styles.input}
            placeholder="Buscar medicamento..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
            <Feather name="sliders" size={24} color={filterCategory || filterMaxPrice > 0 ? "#28a745" : "black"} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
                <Feather name="frown" size={40} color="#ccc" />
                <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
            </View>
          }
        />
      )}

      <FilterBottomSheet 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilters}
        currentCategory={filterCategory}
        currentPrice={filterMaxPrice}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 15,
    padding: 5,
  },
  listContainer: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
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
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginRight: 8
  },
  productOldPrice: {
      fontSize: 12,
      color: 'gray',
      textDecorationLine: 'line-through'
  },
  actionsColumn: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80
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
  emptyState: {
      alignItems: 'center',
      marginTop: 50,
  },
  emptyText: {
      color: 'gray',
      marginTop: 10,
  }
});