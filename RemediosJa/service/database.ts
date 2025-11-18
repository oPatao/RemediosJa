import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('drogarias.db');

export const initDB = async () => {
  try {
    // 1. Tabela de Usuários (já existente)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        pedidos INTEGER DEFAULT 0,
        economizou REAL DEFAULT 0,
        favoritos INTEGER DEFAULT 0
      );
    `);

    // 2. Tabela de Produtos (NOVA)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        pharmacy TEXT NOT NULL,
        price REAL NOT NULL,
        oldPrice REAL
      );
    `);

    const countResult: any = await db.getFirstAsync('SELECT COUNT(*) as count FROM products');
    if (countResult.count === 0) {
      await db.execAsync(`
        INSERT INTO products (name, category, pharmacy, price, oldPrice) VALUES 
        ('Paracetamol 500mg', 'Medicamentos', 'Farmácia Popular', 8.90, 12.90),
        ('Dipirona 500mg', 'Medicamentos', 'Drogaria São Paulo', 6.50, null),
        ('Vitamina C 1g', 'Saúde', 'Farmácia Pacheco', 15.90, 19.90),
        ('Protetor Solar FPS 50', 'Beleza', 'Drogaria Raia', 45.90, 59.90),
        ('Fralda Pampers G', 'Bebê', 'Farmácia Popular', 39.90, null),
        ('Shampoo Anticaspa', 'Higiene', 'Drogaria São Paulo', 22.50, null),
        ('Termômetro Digital', 'Equipamentos', 'Farmácia Pacheco', 29.90, 35.00),
        ('Dorflex 36 cpr', 'Medicamentos', 'Drogaria Raia', 18.90, 24.90);
      `);
      console.log('Produtos iniciais inseridos!');
    }

    console.log('Banco de dados inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao iniciar DB:', error);
    return false;
  }
};

// --- Funções de Usuário (Mantidas) ---
export const getUser = async (email: string) => {
  try {
    return await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email]);
  } catch (error) {
    console.error('Erro get user:', error);
    return null;
  }
};

export const createUser = async (name: string, email: string) => {
  try {
    const result = await db.runAsync('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    return { id: result.lastInsertRowId, name, email, pedidos: 0, economizou: 0, favoritos: 0 };
  } catch (error) {
    console.error("Erro create user", error);
    return null;
  }
};

// --- Funções de Produtos (NOVAS) ---

// Busca produtos com filtros opcionais
export const searchProducts = async (query: string, category: string | null, maxPrice: number) => {
  try {
    let sql = 'SELECT * FROM products WHERE name LIKE ?';
    const params: any[] = [`%${query}%`];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (maxPrice > 0) {
      sql += ' AND price <= ?';
      params.push(maxPrice);
    }

    const result = await db.getAllAsync(sql, params);
    return result;
  } catch (error) {
    console.error('Erro na busca:', error);
    return [];
  }
};