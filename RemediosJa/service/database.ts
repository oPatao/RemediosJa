import { supabase } from './supabase'; 

// --- Mantemos as interfaces iguais para não quebrar o app ---
export interface Product {
  id: number;
  pharmacy_id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image?: string;
  pharmacy_name?: string; 
  isFavorite?: boolean; 
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  pharmacy_id: number;
  pharmacy_name?: string;
  client_name?: string;
  total: number;
  status: 'preparando' | 'enviado' | 'entregue' | 'cancelado';
  date: string;
  items?: OrderItem[];
}

// --- Funções Adaptadas para Supabase ---

// InitDB não é mais necessário para criar tabelas (já criamos no Supabase), 
// mas podemos usar para popular dados iniciais se estiver vazio.
export const initDB = async () => {
  // Verificação simples se já existem produtos
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  
  if (count === 0) {
    console.log("Populando banco de dados na nuvem...");
    // Criar Farmácia Padrão
    const { data: pharmacy } = await supabase
      .from('users')
      .insert({ name: 'Farmácia Popular', email: 'farmacia@popular.com', type: 'pharmacy' })
      .select()
      .single();

    if (pharmacy) {
      const productsToInsert = [
        { pharmacy_id: pharmacy.id, name: 'Paracetamol 500mg', category: 'Medicamentos', price: 8.90, old_price: 12.90, image: '' },
        { pharmacy_id: pharmacy.id, name: 'Dipirona 500mg', category: 'Medicamentos', price: 6.50, image: '' },
        { pharmacy_id: pharmacy.id, name: 'Vitamina C 1g', category: 'Saúde', price: 15.90, old_price: 19.90, image: '' },
        // ... adicione outros se quiser
      ];
      await supabase.from('products').insert(productsToInsert);
    }
  }
  return true;
};

export const getUser = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle(); // maybeSingle não joga erro se não encontrar, retorna null
  
  return data;
};

export const createUser = async (name: string, email: string, type: 'client' | 'pharmacy' = 'client') => {
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, type })
    .select()
    .single();
  
  if (error) throw error;
  return data; // Retorna o objeto usuário criado com ID
};

export const searchProducts = async (query: string, category: string | null, maxPrice: number, userId?: number) => {
  let builder = supabase
    .from('products')
    .select('*, pharmacy:users!pharmacy_id(name)') // Join com users para pegar nome da farmácia
    .ilike('name', `%${query}%`); // ilike é case-insensitive

  if (category) {
    builder = builder.eq('category', category);
  }
  if (maxPrice > 0) {
    builder = builder.lte('price', maxPrice);
  }

  const { data, error } = await builder;
  if (error) {
    console.error(error);
    return [];
  }

  // Mapear retorno do Supabase para o formato do App
  let products = data.map((item: any) => ({
    ...item,
    oldPrice: item.old_price, // Mapeando snake_case para camelCase
    pharmacy_name: item.pharmacy?.name
  }));

  // Verifica favoritos se tiver usuário
  if (userId) {
    const { data: favorites } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId);
    
    const favSet = new Set(favorites?.map(f => f.product_id));
    products = products.map(p => ({ ...p, isFavorite: favSet.has(p.id) }));
  }

  return products;
};

export const getFeaturedProducts = async () => {
  // Supabase não tem RANDOM() simples via JS, vamos pegar 5 aleatórios ou os primeiros 5
  const { data } = await supabase
    .from('products')
    .select('*, pharmacy:users!pharmacy_id(name)')
    .limit(10); // Pegamos 10 para misturar no front se quiser

  if (!data) return [];

  return data.map((item: any) => ({
    ...item,
    oldPrice: item.old_price,
    pharmacy_name: item.pharmacy?.name
  }));
};

export const getPharmacyProducts = async (pharmacyId: number) => {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('pharmacy_id', pharmacyId);
    
  return data?.map((item: any) => ({...item, oldPrice: item.old_price})) || [];
};

export const addProduct = async (pharmacyId: number, name: string, category: string, price: number, oldPrice: number | null, image: string) => {
  const { error } = await supabase.from('products').insert({
    pharmacy_id: pharmacyId,
    name,
    category,
    price,
    old_price: oldPrice,
    image
  });
  if (error) console.error(error);
};

export const updateProduct = async (productId: number, name: string, category: string, price: number, oldPrice: number | null, image: string) => {
  await supabase.from('products').update({
    name, category, price, old_price: oldPrice, image
  }).eq('id', productId);
};

export const deleteProduct = async (productId: number) => {
  await supabase.from('products').delete().eq('id', productId);
};

export const saveOrderSQL = async (userId: number, cartItems: any[]) => {
  // Nota: Em produção, idealmente usaria uma RPC (Procedure) no Supabase para garantir transação
  // Mas vamos fazer sequencialmente para simplificar
  
  // Agrupar por farmácia
  const itemsByPharmacy: any = {};
  cartItems.forEach(item => {
      const pId = item.pharmacy_id || 1; // Fallback se não tiver ID
      if (!itemsByPharmacy[pId]) itemsByPharmacy[pId] = [];
      itemsByPharmacy[pId].push(item);
  });

  const orderIds = [];

  for (const pharmacyId of Object.keys(itemsByPharmacy)) {
    const items = itemsByPharmacy[pharmacyId];
    const total = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);

    // 1. Criar Pedido
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        pharmacy_id: parseInt(pharmacyId),
        total,
        status: 'preparando',
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error("Erro ao criar pedido", orderError);
      continue;
    }

    orderIds.push(orderData.id);

    // 2. Criar Itens do Pedido
    const itemsToInsert = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    await supabase.from('order_items').insert(itemsToInsert);
  }

  return orderIds[0];
};

export const getClientOrders = async (userId: number) => {
  const { data: orders } = await supabase
    .from('orders')
    .select('*, pharmacy:users!pharmacy_id(name), items:order_items(*)')
    .eq('user_id', userId)
    .order('id', { ascending: false });

  if (!orders) return [];

  return orders.map((o: any) => ({
    ...o,
    pharmacy_name: o.pharmacy?.name
  }));
};

export const getPharmacyOrders = async (pharmacyId: number) => {
  const { data: orders } = await supabase
    .from('orders')
    .select('*, client:users!user_id(name), items:order_items(*)')
    .eq('pharmacy_id', pharmacyId)
    .order('id', { ascending: false });

  if (!orders) return [];

  return orders.map((o: any) => ({
    ...o,
    client_name: o.client?.name
  }));
};

export const removeOrderItem = async (orderId: number, itemId: number, itemPrice: number, itemQty: number) => {
  // Remover item
  await supabase.from('order_items').delete().eq('id', itemId);
  
  // Buscar total atual do pedido
  const { data: order } = await supabase.from('orders').select('total').eq('id', orderId).single();
  
  if (order) {
    const newTotal = order.total - (itemPrice * itemQty);
    await supabase.from('orders').update({ total: newTotal }).eq('id', orderId);
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  await supabase.from('orders').update({ status }).eq('id', orderId);
};

export const toggleFavorite = async (userId: number, productId: number) => {
  // Verificar se existe
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (data) {
    await supabase.from('favorites').delete().eq('id', data.id);
    return false;
  } else {
    await supabase.from('favorites').insert({ user_id: userId, product_id: productId });
    return true;
  }
};

export const getFavorites = async (userId: number) => {
  const { data } = await supabase
    .from('favorites')
    .select('product:products(*, pharmacy:users(name))') // Nested select
    .eq('user_id', userId);

  if (!data) return [];

  // Flattening the structure
  return data.map((fav: any) => ({
    ...fav.product,
    oldPrice: fav.product.old_price,
    pharmacy_name: fav.product.pharmacy?.name
  }));
};