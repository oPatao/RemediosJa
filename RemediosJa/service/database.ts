import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('drogarias_v3.db');

export interface Product {
  id: number;
  pharmacy_id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image?: string;
  pharmacy_name?: string; 
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

export const initDB = async () => {
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL DEFAULT 'client', 
        pedidos INTEGER DEFAULT 0,
        economizou REAL DEFAULT 0
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pharmacy_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        oldPrice REAL,
        image TEXT,
        FOREIGN KEY(pharmacy_id) REFERENCES users(id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pharmacy_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(pharmacy_id) REFERENCES users(id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id)
      );
    `);

    const countResult: any = await db.getFirstAsync('SELECT COUNT(*) as count FROM products');
    if (countResult.count === 0) {
      
      let pharmacy = await db.getFirstAsync('SELECT * FROM users WHERE email = ?', ['farmacia@popular.com']) as any;
      
      if (!pharmacy) {
        const res = await db.runAsync('INSERT INTO users (name, email, type) VALUES (?, ?, ?)', ['Farmácia Popular', 'farmacia@popular.com', 'pharmacy']);
        pharmacy = { id: res.lastInsertRowId };
      }

      await db.runAsync(`
        INSERT INTO products (pharmacy_id, name, category, price, oldPrice, image) VALUES 
        (?, 'Paracetamol 500mg', 'Medicamentos', 8.90, 12.90, ''),
        (?, 'Dipirona 500mg', 'Medicamentos', 6.50, null, ''),
        (?, 'Vitamina C 1g', 'Saúde', 15.90, 19.90, ''),
        (?, 'Protetor Solar FPS 50', 'Beleza', 45.90, 59.90, ''),
        (?, 'Fralda Pampers G', 'Bebê', 39.90, null, ''),
        (?, 'Shampoo Anticaspa', 'Higiene', 22.50, null, ''),
        (?, 'Termômetro Digital', 'Equipamentos', 29.90, 35.00, ''),
        (?, 'Dorflex 36 cpr', 'Medicamentos', 18.90, 24.90, '');
      `, [pharmacy.id, pharmacy.id, pharmacy.id, pharmacy.id, pharmacy.id, pharmacy.id, pharmacy.id, pharmacy.id]);
      
      console.log('Produtos iniciais inseridos e vinculados!');
    }

    return true;
  } catch (error) {
    console.error('Erro initDB:', error);
    return false;
  }
};

export const getUser = async (email: string) => {
  return await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email]);
};

export const createUser = async (name: string, email: string, type: 'client' | 'pharmacy' = 'client') => {
  const result = await db.runAsync('INSERT INTO users (name, email, type) VALUES (?, ?, ?)', [name, email, type]);
  return { id: result.lastInsertRowId, name, email, type, pedidos: 0, economizou: 0 };
};

export const searchProducts = async (query: string, category: string | null, maxPrice: number) => {
  try {
    let sql = `
      SELECT p.*, u.name as pharmacy_name 
      FROM products p 
      JOIN users u ON p.pharmacy_id = u.id 
      WHERE p.name LIKE ?
    `;
    const params: any[] = [`%${query}%`];

    if (category) {
      sql += ' AND p.category = ?';
      params.push(category);
    }
    if (maxPrice > 0) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    return await db.getAllAsync(sql, params);
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
};

// NOVA FUNÇÃO: Pegar produtos para a Home
export const getFeaturedProducts = async () => {
  try {
    return await db.getAllAsync(`
      SELECT p.*, u.name as pharmacy_name 
      FROM products p 
      JOIN users u ON p.pharmacy_id = u.id 
      ORDER BY RANDOM() LIMIT 5
    `);
  } catch (error) {
    return [];
  }
};

export const getPharmacyProducts = async (pharmacyId: number) => {
  return await db.getAllAsync('SELECT * FROM products WHERE pharmacy_id = ?', [pharmacyId]);
};

export const addProduct = async (pharmacyId: number, name: string, category: string, price: number, oldPrice: number | null, image: string) => {
  return await db.runAsync(
    'INSERT INTO products (pharmacy_id, name, category, price, oldPrice, image) VALUES (?, ?, ?, ?, ?, ?)',
    [pharmacyId, name, category, price, oldPrice, image]
  );
};

export const updateProduct = async (productId: number, name: string, category: string, price: number, oldPrice: number | null, image: string) => {
  return await db.runAsync(
    'UPDATE products SET name = ?, category = ?, price = ?, oldPrice = ?, image = ? WHERE id = ?',
    [name, category, price, oldPrice, image, productId]
  );
};

export const deleteProduct = async (productId: number) => {
  return await db.runAsync('DELETE FROM products WHERE id = ?', [productId]);
};

export const saveOrderSQL = async (userId: number, cartItems: any[]) => {
  try {
    // Busca uma farmácia padrão caso algum item venha sem ID (fallback de segurança)
    let defaultPharmacyId = 1;
    const pharmacyCheck = await db.getFirstAsync<{id: number}>('SELECT id FROM users WHERE type = ? LIMIT 1', ['pharmacy']);
    if (pharmacyCheck) defaultPharmacyId = pharmacyCheck.id;

    const itemsByPharmacy: any = {};
    
    cartItems.forEach(item => {
        // Garante que temos um ID de farmácia válido
        const pId = item.pharmacy_id || defaultPharmacyId; 
        if (!itemsByPharmacy[pId]) itemsByPharmacy[pId] = [];
        itemsByPharmacy[pId].push(item);
    });

    const orderIds = [];

    for (const pharmacyId of Object.keys(itemsByPharmacy)) {
      const items = itemsByPharmacy[pharmacyId];
      const total = items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
      
      const result = await db.runAsync(
        'INSERT INTO orders (user_id, pharmacy_id, total, status, date) VALUES (?, ?, ?, ?, ?)',
        [userId, pharmacyId, total, 'preparando', new Date().toISOString()]
      );
      
      const orderId = result.lastInsertRowId;
      orderIds.push(orderId);

      for (const item of items) {
        await db.runAsync(
          'INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.id || 0, item.name, item.price, item.quantity]
        );
      }
    }
    
    return orderIds[0]; 
  } catch (e) {
    console.error("Erro ao salvar pedido SQL", e);
    throw e;
  }
};

export const getClientOrders = async (userId: number) => {
  const orders = await db.getAllAsync<Order>(`
    SELECT o.*, u.name as pharmacy_name 
    FROM orders o 
    JOIN users u ON o.pharmacy_id = u.id 
    WHERE o.user_id = ? 
    ORDER BY o.id DESC`, 
    [userId]
  );
  
  for (let order of orders) {
    order.items = await db.getAllAsync('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
  }
  return orders;
};

export const getPharmacyOrders = async (pharmacyId: number) => {
  const orders = await db.getAllAsync<Order>(`
    SELECT o.*, u.name as client_name 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    WHERE o.pharmacy_id = ? 
    ORDER BY o.id DESC`, 
    [pharmacyId]
  );

  for (let order of orders) {
    order.items = await db.getAllAsync('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
  }
  return orders;
};

export const removeOrderItem = async (orderId: number, itemId: number, itemPrice: number, itemQty: number) => {
  await db.runAsync('DELETE FROM order_items WHERE id = ?', [itemId]);
  await db.runAsync('UPDATE orders SET total = total - ? WHERE id = ?', [itemPrice * itemQty, orderId]);
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  await db.runAsync('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
};