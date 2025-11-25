import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { 
  addProduct, 
  updateProduct,
  getPharmacyProducts, 
  deleteProduct, 
  getPharmacyOrders, 
  updateOrderStatus, 
  removeOrderItem 
} from '../../service/database';

const CATEGORIES = ['Medicamentos', 'Saúde', 'Bebê', 'Beleza', 'Higiene', 'Equipamentos'];

const ProductsTab = ({ user }: { user: any }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [category, setCategory] = useState('Medicamentos');
  const [image, setImage] = useState('');

  const loadProducts = async () => {
    if(user) {
      const res = await getPharmacyProducts(user.id);
      setProducts(res);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const clearForm = () => {
    setName(''); setPrice(''); setOldPrice(''); setImage(''); setCategory('Medicamentos'); setEditingId(null);
  };

  const handleSave = async () => {
    if (!name || !price) return Alert.alert("Erro", "Preencha nome e preço");
    
    const priceNum = parseFloat(price.replace(',', '.'));
    const oldPriceNum = oldPrice ? parseFloat(oldPrice.replace(',', '.')) : null;

    if (editingId) {
      await updateProduct(editingId, name, category, priceNum, oldPriceNum, image);
      Alert.alert("Sucesso", "Produto atualizado!");
    } else {
      await addProduct(user.id, name, category, priceNum, oldPriceNum, image);
      Alert.alert("Sucesso", "Produto criado!");
    }
    clearForm();
    loadProducts();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setOldPrice(item.oldPrice ? item.oldPrice.toString() : '');
    setCategory(item.category);
    setImage(item.image || '');
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar" },
      { text: "Sim", onPress: async () => { await deleteProduct(id); loadProducts(); } }
    ]);
  };

  return (
    <View style={styles.tabContent}>
      <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.addForm}>
          <Text style={styles.sectionTitle}>{editingId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</Text>
          
          <Text style={styles.label}>Nome</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Ex: Dipirona" 
          />
          
          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 10}}>
              <Text style={styles.label}>Preço (R$)</Text>
              <TextInput 
                style={styles.input} 
                value={price} 
                onChangeText={setPrice} 
                keyboardType="numeric" 
                placeholder="10.00" 
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Preço Antigo (Promo)</Text>
              <TextInput 
                style={styles.input} 
                value={oldPrice} 
                onChangeText={setOldPrice} 
                keyboardType="numeric" 
                placeholder="15.00" 
              />
            </View>
          </View>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>URL da Imagem</Text>
          <TextInput 
            style={styles.input} 
            value={image} 
            onChangeText={setImage} 
            placeholder="https://..." 
          />

          <View style={styles.row}>
            {editingId && (
              <TouchableOpacity 
                style={[styles.addButton, styles.cancelButton]} 
                onPress={clearForm}
              >
                <Text style={styles.addButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.addButton, {flex: 2}]} onPress={handleSave}>
              <Text style={styles.addButtonText}>{editingId ? 'Atualizar' : 'Cadastrar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        style={{marginTop: 10}}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => handleEdit(item)}>
            <View style={styles.listImage}>
               {item.image ? 
                 <Image source={{uri: item.image}} style={{width: 40, height: 40, borderRadius: 4}} /> : 
                 <Feather name="image" size={24} color="#ccc" />
               }
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSub}>
                R$ {item.price.toFixed(2)} 
                {item.oldPrice && (
                  <Text style={styles.oldPriceText}> R$ {item.oldPrice.toFixed(2)}</Text>
                )}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Feather name="trash-2" size={20} color="#dc3545" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const OrdersTab = ({ user }: { user: any }) => {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    if(user) {
      const res = await getPharmacyOrders(user.id);
      setOrders(res);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleRemoveItem = async (order: any, item: any) => {
    Alert.alert("Remover Item", `Tirar ${item.name} do pedido?`, [
      { text: "Cancelar" },
      { 
        text: "Remover", onPress: async () => {
          await removeOrderItem(order.id, item.id, item.price, item.quantity);
          loadOrders();
        }
      }
    ]);
  };

  const handleStatus = async (orderId: number) => {
    Alert.alert("Atualizar Status", "Mudar para:", [
      { text: "Enviado", onPress: async () => { await updateOrderStatus(orderId, 'enviado'); loadOrders(); } },
      { text: "Entregue", onPress: async () => { await updateOrderStatus(orderId, 'entregue'); loadOrders(); } },
      { text: "Cancelar", style: 'cancel' }
    ]);
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Pedidos Recebidos</Text>
        <TouchableOpacity onPress={loadOrders}>
          <Feather name="refresh-cw" size={20} color="#007bff"/>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>Pedido #{item.id} - {item.client_name}</Text>
              <TouchableOpacity onPress={() => handleStatus(item.id)}>
                <View style={styles.statusBadgeContainer}>
                  <Text style={styles.statusBadge}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.orderDate}>{new Date(item.date).toLocaleString()}</Text>
            
            <View style={styles.divider}/>
            
            {item.items && item.items.map((prod: any) => (
              <View key={prod.id} style={styles.orderItemRow}>
                <Text style={styles.orderItemText}>{prod.quantity}x {prod.name}</Text>
                <Text style={styles.orderItemPrice}>R$ {prod.price.toFixed(2)}</Text>
                {item.status === 'preparando' && (
                  <TouchableOpacity onPress={() => handleRemoveItem(item, prod)}>
                    <Feather name="x-circle" size={18} color="#dc3545" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <View style={styles.divider}/>
            <Text style={styles.totalText}>Total: R$ {item.total.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default function PharmacyScreen() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'products' | 'orders'>('orders');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{user?.name}</Text>
          <Text style={styles.headerSub}>Painel da Farmácia</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Feather name="log-out" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tabItem, tab === 'orders' && styles.tabActive]} 
          onPress={() => setTab('orders')}
        >
          <Text style={[styles.tabText, tab === 'orders' && styles.tabTextActive]}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, tab === 'products' && styles.tabActive]} 
          onPress={() => setTab('products')}
        >
          <Text style={[styles.tabText, tab === 'products' && styles.tabTextActive]}>Produtos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'products' ? <ProductsTab user={user} /> : <OrdersTab user={user} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSub: {
    fontSize: 12,
    color: 'gray',
  },
  logoutBtn: {
    padding: 10,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  tabItem: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#28a745',
  },
  tabText: {
    color: 'gray',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tabContent: {
    flex: 1,
  },
  // Estilos de Formulário
  formScroll: {
    maxHeight: 400,
  },
  addForm: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    marginRight: 10,
    flex: 1,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos da Lista de Produtos
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  listImage: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  itemSub: {
    color: '#28a745',
    fontWeight: 'bold',
    marginTop: 2,
  },
  oldPriceText: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 12,
    fontWeight: 'normal',
  },
  itemCategory: {
    fontSize: 10,
    color: 'gray',
    marginTop: 2,
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 10,
  },
  // Estilos de Categorias (Chips)
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryChipSelected: {
    backgroundColor: '#e6f7eb',
    borderColor: '#28a745',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#555',
  },
  categoryChipTextSelected: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  // Estilos de Pedidos
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBadgeContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadge: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  orderDate: {
    color: 'gray',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  orderItemPrice: {
    marginRight: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  totalText: {
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 18,
    color: '#333',
  },
});