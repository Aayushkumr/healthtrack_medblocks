import React, { useState } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { executeQuery } from '../services/DatabaseService';
import { Play, Database, AlertCircle } from 'lucide-react';
import LoadingState from '../components/LoadingState.tsx';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface QueryResult {
  success: boolean;
  data: any[];
  error: string | null;
}

const PatientQuery: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM patients LIMIT 10');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  const exampleQueries = [
    { name: 'List all patients', query: 'SELECT * FROM patients ORDER BY created_at DESC LIMIT 10' },
    { name: 'Count patients by gender', query: 'SELECT gender, COUNT(*) AS count FROM patients GROUP BY gender ORDER BY count DESC' },
    { name: 'Recent patients', query: 'SELECT id, first_name, last_name, created_at FROM patients ORDER BY created_at DESC LIMIT 5' },
    { name: 'Search by name', query: "SELECT * FROM patients WHERE first_name LIKE '%John%' OR last_name LIKE '%John%'" },
    { name: 'Patient with insurance', query: "SELECT * FROM patients WHERE insurance_provider IS NOT NULL" }
  ];

  const schemaReference = [
    { name: 'id', type: 'INTEGER', description: 'Primary key' },
    { name: 'first_name', type: 'TEXT', description: 'First name (required)' },
    { name: 'last_name', type: 'TEXT', description: 'Last name (required)' },
    { name: 'date_of_birth', type: 'TEXT', description: 'ISO format date (required)' },
    { name: 'gender', type: 'TEXT', description: 'Gender (required)' },
    { name: 'email', type: 'TEXT', description: 'Email address' },
    { name: 'phone', type: 'TEXT', description: 'Phone number' },
    { name: 'address', type: 'TEXT', description: 'Physical address' },
    { name: 'medical_notes', type: 'TEXT', description: 'Notes about medical condition' },
    { name: 'insurance_provider', type: 'TEXT', description: 'Insurance provider name' },
    { name: 'insurance_id', type: 'TEXT', description: 'Insurance ID number' },
    { name: 'created_at', type: 'TIMESTAMP', description: 'Record creation date' }
  ];

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  const selectQuery = (query: string) => {
    setSqlQuery(query);
  };

  const executeQueryHandler = async () => {
    if (!isInitialized || !sqlQuery.trim()) return;
    
    setIsExecuting(true);
    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult({
        success: true,
        data: result.rows || [],
        error: null
      });
    } catch (err: any) {
      setQueryResult({
        success: false,
        data: [],
        error: err.message || 'Failed to execute query'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="page-transition">
        <header className="page-header">
          <h1 className="page-title">Query Database</h1>
          <p className="page-subtitle">Explore patient data using SQL queries</p>
        </header>
        
        <div className="card p-8 text-center">
          <Database className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Database Not Ready</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Waiting for database to initialize. Please try again in a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="page-header">
        <h1 className="page-title">Query Database</h1>
        <p className="page-subtitle">Explore patient data using SQL queries</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="card mb-6">
            <label htmlFor="sql-query" className="form-label">
              SQL Query
            </label>
            <textarea
              id="sql-query"
              value={sqlQuery}
              onChange={handleQueryChange}
              className="form-input font-mono text-sm w-full h-40"
              placeholder="Enter your SQL query here..."
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={executeQueryHandler}
                disabled={isExecuting || !sqlQuery.trim()}
                className="btn btn-primary btn-icon"
              >
                {isExecuting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Execute Query
                  </>
                )}
              </button>
            </div>
          </div>

          {isExecuting ? (
            <LoadingState message="Executing query..." size="small" />
          ) : queryResult && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Query Results</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {queryResult.data.length} row(s) returned
                </span>
              </div>

              {queryResult.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="text-red-800 dark:text-red-300 font-medium">Query Error</h3>
                      <p className="text-red-700 dark:text-red-400 text-sm">{queryResult.error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6">
                  <div className="inline-block min-w-full align-middle px-6">
                    <div className="table-container">
                      {queryResult.data.length === 0 ? (
                        <div className="py-4 text-center text-slate-500 dark:text-slate-400">
                          No data returned for this query
                        </div>
                      ) : (
                        <table className="data-table">
                          <thead>
                            <tr>
                              {Object.keys(queryResult.data[0]).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResult.data.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td key={`${rowIndex}-${cellIndex}`}>
                                    {value === null ? (
                                      <span className="text-xs text-slate-400">NULL</span>
                                    ) : (
                                      String(value)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="card mb-6">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              Example Queries
            </h2>
            <div className="space-y-3">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => selectQuery(example.query)}
                  className="w-full text-left p-3 text-sm rounded-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              Schema Reference
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {schemaReference.map((column, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-md p-3">
                  <div className="font-medium text-slate-900 dark:text-white mb-1">
                    {column.name}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">{column.type}</span>
                    <span className="text-slate-500 dark:text-slate-400">{column.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientQuery;