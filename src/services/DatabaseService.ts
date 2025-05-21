/* eslint-disable @typescript-eslint/no-explicit-any */

import { PGliteWorker } from '@electric-sql/pglite/worker';

interface PGliteWorkerInterface {
  query: (sql: string, params?: any[]) => Promise<any>;
}

let db: PGliteWorkerInterface | null = null;

const initSchema = async (database: PGliteWorkerInterface) => {
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

export const initDatabase = async (): Promise<PGliteWorkerInterface> => {
  if (!db) {
    console.log("Starting database initialization");
    
    try {

      const workerInstance = new Worker(new URL('/pglite-worker.js', import.meta.url), {
        type: 'module',
      });
      

      db = new PGliteWorker(workerInstance);
      
      // Initialize schema
      console.log("Starting schema initialization");
      await initSchema(db);
      console.log("Schema initialization completed");
      
    } catch (error) {
      console.error('Failed to initialize PGlite:', error);
      throw error;
    }
  }
  
  return db;
};

export const registerPatient = async (patientData: any): Promise<any> => {
  console.log("Starting patient registration:", patientData);
  try {
    const database = await initDatabase();
    console.log("Database initialized for registration");
    
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

    console.log("Executing INSERT query");
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

    console.log("Query result:", result);
    return result.rows?.[0];
  } catch (error) {
    console.error("Error in registerPatient:", error);
    throw error;
  }
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