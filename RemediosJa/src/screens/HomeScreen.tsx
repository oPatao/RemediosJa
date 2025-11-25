import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCart } from '../../context/CartContext';
import { getFeaturedProducts } from '../../service/database';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Buscar: undefined;
};
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Product {
    id: number; 
    name: string; 
    pharmacy: string; 
    pharmacy_id?: number;
    price: number; 
    oldPrice?: number;
    image?: string;
    pharmacy_name?: string;
}

const promotions = [
    { id: '1', title: 'Frete Grátis', subtitle: 'Em pedidos acima de R$ 50', color: '#e0f3f5' },
    { id: '2', title: '20% OFF', subtitle: 'Em medicamentos genéricos', color: '#e3f2fd' },
];
const categories = [
    { id: '1', name: 'Medicamentos', icon: <FontAwesome5 name="pills" size={24} color="#007bff" /> },
    { id: '2', name: 'Saúde', icon: <AntDesign name="heart" size={24} color="#dc3545" /> },
    { id: '3', name: 'Bebê', icon: <MaterialCommunityIcons name="baby-bottle-outline" size={24} color="#ffc107" /> },
    { id: '4', name: 'Beleza', icon: <MaterialCommunityIcons name="lipstick" size={24} color="#fd7e14" /> },
    { id: '5', name: 'Higiene', icon: <FontAwesome5 name="soap" size={24} color="#28a745" /> },
    { id: '6', name: 'Equipamentos', icon: <MaterialCommunityIcons name="thermometer" size={24} color="#17a2b8" /> },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { addItem, cart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const loadData = async () => {
    const products: any = await getFeaturedProducts();
    const formatted = products.map((p: any) => ({
        ...p,
        pharmacy: p.pharmacy_name || 'Farmácia'
    }));
    setFeaturedProducts(formatted);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddToCart = (prod: Product) => {
    addItem({ 
        id: prod.id, 
        name: prod.name, 
        pharmacy: prod.pharmacy, 
        price: prod.price,
        pharmacy_id: prod.pharmacy_id // Importante passar isso para o pedido
    } as any);
  };

  const ProductCard = ({ prod }: { prod: Product }) => (
    <View key={prod.id} style={styles.productCard}>
      <View style={styles.productImagePlaceholder}>
         {prod.image ? (
           <Image source={{ uri: prod.image }} style={styles.productImage} />
         ) : (
           <Feather name="image" size={24} color="#ccc" />
         )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{prod.name}</Text>
        <Text style={styles.productPharmacy}>{prod.pharmacy}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>R$ {prod.price.toFixed(2).replace('.', ',')}</Text>
          {prod.oldPrice && <Text style={styles.productOldPrice}>R$ {prod.oldPrice.toFixed(2).replace('.', ',')}</Text>}
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(prod)}>
        <Text style={styles.addButtonText}>+ Adicionar</Text>
      </TouchableOpacity>
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

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="gray" />
          <Text style={styles.searchInput}>Busque por medicamentos, vitaminas...</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          horizontal
          data={promotions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.promoCard, { backgroundColor: item.color }]}>
              <View style={styles.promoIcon}></View>
              <View>
                <Text style={styles.promoTitle}>{item.title}</Text>
                <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.promosContainer}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriesContainer}>
            {categories.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                <View style={styles.categoryIconContainer}>{cat.icon}</View>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produtos em destaque</Text>
          {loading ? (
             <ActivityIndicator size="small" color="#28a745" />
          ) : (
             featuredProducts.map(prod => (
                <ProductCard key={prod.id} prod={prod} />
             ))
          )}
          
          <TouchableOpacity 
            style={styles.seeMoreButton} 
            onPress={() => navigation.navigate('Buscar')}
          >
            <Text style={styles.seeMoreButtonText}>Ver mais produtos</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 20}} />
      </ScrollView>
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
      paddingBottom: 10,
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
    promosContainer: {
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    promoCard: {
      width: 250,
      height: 80,
      borderRadius: 8,
      marginRight: 10,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    promoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.1)',
      marginRight: 10,
    },
    promoTitle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    promoSubtitle: {
      fontSize: 12,
    },
    section: {
      paddingHorizontal: 15,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '31%',
      alignItems: 'center',
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: '#f0f0f0',
      borderRadius: 8,
      marginBottom: 10,
    },
    categoryIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    categoryText: {
      fontSize: 12,
    },
    productCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    productImagePlaceholder: {
      width: 80,
      height: 80,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      marginRight: 15,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center'
    },
    productImage: {
      width: '100%',
      height: '100%',
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    productPharmacy: {
      color: 'gray',
      fontSize: 12,
      marginVertical: 2,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    productPrice: {
      fontWeight: 'bold',
      color: '#28a745',
    },
    productOldPrice: {
      color: 'gray',
      textDecorationLine: 'line-through',
      marginLeft: 5,
    },
    addButton: {
      backgroundColor: 'black',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
    addButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    seeMoreButton: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      marginTop: 10,
    },
    seeMoreButtonText: {
      fontWeight: 'bold',
      color: '#28a745',
    },
    seeAllText: {
      color: '#28a745',
      fontWeight: 'bold',
    },
    pharmacyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    pharmacyIconPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
    },
    pharmacyInfo: {
      flex: 1,
    },
    pharmacyName: {
      fontWeight: 'bold',
    },
    pharmacyDetails: {
      color: 'gray',
      fontSize: 12,
    },
    deliveryBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
    },
    deliveryText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
});