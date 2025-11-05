import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Tipagem para a navegação
type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
};
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// --- DADOS MOCKADOS ---
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
const featuredProducts = [
    { id: '1', name: 'Paracetamol 500mg', pharmacy: 'Farmácia Popular', price: '8.90', oldPrice: '12.90' },
    { id: '2', name: 'Dipirona 500mg', pharmacy: 'Drogaria São Paulo', price: '6.50' },
    { id: '3', name: 'Vitamina C 1g', pharmacy: 'Farmácia Pacheco', price: '15.90', oldPrice: '19.90' },
];
const nearbyPharmacies = [
    { id: '1', name: 'Farmácia Vida Que Segue', rating: 4.8, time: '15-25 min', distance: '0.5 km', delivery: 'Grátis' },
    { id: '2', name: 'Drogaria RM', rating: 4.6, time: '20-30 min', distance: '1.2 km', delivery: 'R$ 4,99' },
];


export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* --- CABEÇALHO --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTextSmall}>Entregar em</Text>
          <Text style={styles.headerTextLarge}>Esquina dos Fogos De Artificio, 136 ▼</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Feather name="shopping-cart" size={24} color="black" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <Feather name="user" size={24} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      {/* --- BARRA DE BUSCA --- */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="gray" />
          <Text style={styles.searchInput}>Busque por medicamentos, vitaminas...</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- PROMOÇÕES --- */}
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

        {/* --- CATEGORIAS --- */}
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

        {/* --- PRODUTOS EM DESTAQUE --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produtos em destaque</Text>
          {featuredProducts.map(prod => (
            <View key={prod.id} style={styles.productCard}>
              <View style={styles.productImagePlaceholder} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{prod.name}</Text>
                <Text style={styles.productPharmacy}>{prod.pharmacy}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.productPrice}>R$ {prod.price}</Text>
                  {prod.oldPrice && <Text style={styles.productOldPrice}>R$ {prod.oldPrice}</Text>}
                </View>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreButtonText}>Ver mais produtos</Text>
          </TouchableOpacity>
        </View>

        {/* --- FARMÁCIAS PRÓXIMAS --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Farmácias próximas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {nearbyPharmacies.map(pharm => (
            <TouchableOpacity key={pharm.id} style={styles.pharmacyCard}>
              <View style={styles.pharmacyIconPlaceholder} />
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName}>{pharm.name}</Text>
                <Text style={styles.pharmacyDetails}>⭐ {pharm.rating}  🕒 {pharm.time}  🛵 {pharm.distance}</Text>
              </View>
              <View style={[styles.deliveryBadge, { backgroundColor: pharm.delivery === 'Grátis' ? '#28a745' : '#f0f0f0' }]}>
                <Text style={[styles.deliveryText, { color: pharm.delivery === 'Grátis' ? '#fff' : '#555' }]}>{pharm.delivery}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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