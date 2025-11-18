import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { searchProducts } from '../../service/database';
import FilterBottomSheet from '../../components/FilterBottomSheet';

// Define a interface do Produto para o TypeScript
interface Product {
    id: number;
    name: string;
    category: string;
    pharmacy: string;
    price: number;
    oldPrice?: number;
}

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados do Filtro
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(0);

  // Função para buscar no banco
  const fetchProducts = async () => {
    setLoading(true);
    const results = await searchProducts(searchText, filterCategory, filterMaxPrice);
    setProducts(results as Product[]);
    setLoading(false);
  };

  // Atualiza a busca sempre que o texto ou filtros mudarem
  useEffect(() => {
    // Debounce simples para não buscar a cada letra instantaneamente
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, filterCategory, filterMaxPrice]);

  const handleApplyFilters = (cat: string | null, price: number) => {
      setFilterCategory(cat);
      setFilterMaxPrice(price);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.imagePlaceholder}>
         {/* Aqui você colocaria a imagem real se tivesse url no banco */}
         <Feather name="image" size={24} color="#ccc" />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPharmacy}>{item.pharmacy}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.priceRow}>
            <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
            {item.oldPrice && (
                <Text style={styles.productOldPrice}>R$ {item.oldPrice.toFixed(2)}</Text>
            )}
        </View>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Feather name="plus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header da Busca */}
      <View style={styles.header}>
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

      {/* Lista de Resultados */}
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

      {/* Componente Bottom Sheet */}
      <FilterBottomSheet 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilters}
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
      marginRight: 15
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
      overflow: 'hidden' // necessário para borderRadius em Text no Android
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