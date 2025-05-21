import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from '../services/DatabaseService';

type DatabaseContextType = {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

const DatabaseContext = createContext<DatabaseContextType>({
  isLoading: true,
  isInitialized: false,
  error: null,
});

export const useDatabaseContext = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      console.log("Starting database context initialization");
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Give the UI a chance to render before starting heavy initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log("Calling initDatabase()");
        await initDatabase();
        
        console.log("Database initialized successfully");
        setIsInitialized(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Failed to initialize database:', err);
        setError(err.message || 'Unknown database initialization error');
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <DatabaseContext.Provider value={{ isLoading, isInitialized, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};