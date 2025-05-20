/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/DatabaseService.ts
interface PGliteWorker {
  query: (sql: string, params?: any[]) => Promise<any>;
}

let db: PGliteWorker | null = null;

const initSchema = async (database: PGliteWorker) => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      medical_notes TEXT,
      insurance_provider TEXT,
      insurance_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.query(`
    CREATE INDEX IF NOT EXISTS idx_patient_name ON patients (last_name, first_name);
  `);

  console.log("Database schema initialized");
};

export const initDatabase = async (): Promise<PGliteWorker> => {
  if (!db) {
    try {
      const PGliteWorker = new Worker('/pglite-worker.js', { type: 'module' });
      db = {
        query: async (sql: string, params: any[] = []) => {
          const id = Math.random().toString(36).slice(2);
          
          return new Promise((resolve, reject) => {
            const handler = (e: MessageEvent) => {
              if (e.data.id !== id) return;
              PGliteWorker.removeEventListener('message', handler);
              if (e.data.error) {
                reject(new Error(e.data.error));
              } else {
                resolve(e.data.result);
              }
            };
            
            PGliteWorker.addEventListener('message', handler);
            PGliteWorker.postMessage({ id, sql, params });
          });
        }
      };
      
      await initSchema(db);
    } catch (error) {
      console.error('Failed to initialize PGlite:', error);
      throw error;
    }
  }
  return db;
};

export const registerPatient = async (patientData: any): Promise<any> => {
  const database = await initDatabase();
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    medical_notes,
    insurance_provider,
    insurance_id,
  } = patientData;

  const result = await database.query(
    `INSERT INTO patients 
      (first_name, last_name, date_of_birth, gender, email, phone, address, medical_notes, insurance_provider, insurance_id) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      first_name,
      last_name,
      date_of_birth,
      gender,
      email || null,
      phone || null,
      address || null,
      medical_notes || null,
      insurance_provider || null,
      insurance_id || null,
    ]
  );

  return result.rows?.[0];
};

export const getAllPatients = async (): Promise<any[]> => {
  const database = await initDatabase();
  try {
    const result = await database.query(
      "SELECT * FROM patients ORDER BY last_name, first_name"
    );
    return result.rows || [];
  } catch (error) {
    console.error('Error executing getAllPatients query:', error);
    throw error;
  }
};

export const searchPatientsByName = async (
  searchTerm: string
): Promise<any[]> => {
  const database = await initDatabase();
  try {
    const query = `
      SELECT * FROM patients 
      WHERE 
        first_name ILIKE $1 OR 
        last_name ILIKE $1 OR 
        first_name || ' ' || last_name ILIKE $1
      ORDER BY last_name, first_name
    `;
    const result = await database.query(query, [`%${searchTerm}%`]);
    return result.rows || [];
  } catch (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
};

export const executeQuery = async (
  sqlQuery: string,
  params: any[] = []
): Promise<any> => {
  try {
    const database = await initDatabase();
    const result = await database.query(sqlQuery, params);
    return {
      success: true,
      data: result.rows || [],
      error: null
    };
  } catch (error: any) {
    console.error('Error executing query:', error);
    return {
      success: false,
      data: [],
      error: error.message
    };
  }
};