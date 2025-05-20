import React, { useState } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { executeQuery } from '../services/DatabaseService';
import { Play, Copy, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QueryResult {
  success: boolean;
  data: any[];
  error: string | null;
}

const PatientQuery: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM patients LIMIT 10');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  const executeQueryHandler = async () => {
    if (!isInitialized || !sqlQuery.trim()) return;
    
    setIsExecuting(true);
    
    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);
    } catch (error: any) {
      setQueryResult({
        success: false,
        data: [],
        error: error.message || 'An error occurred while executing the query'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = () => {
    if (!queryResult?.data) return;
    
    try {
      navigator.clipboard.writeText(JSON.stringify(queryResult.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const selectQuery = (query: string) => {
    setSqlQuery(query);
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Example queries
  const exampleQueries = [
    { 
      name: 'List All Patients', 
      query: 'SELECT * FROM patients' 
    },
    { 
      name: 'Count Patients by Gender', 
      query: 'SELECT gender, COUNT(*) as count FROM patients GROUP BY gender' 
    },
    { 
      name: 'Patients with Insurance', 
      query: "SELECT first_name, last_name, insurance_provider FROM patients WHERE insurance_provider IS NOT NULL" 
    },
    { 
      name: 'Recently Added', 
      query: "SELECT * FROM patients ORDER BY created_at DESC LIMIT 5" 
    }
  ];

  return (
    <div className="page-transition">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SQL Query Tool</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Execute custom SQL queries against the patient database
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
            <label htmlFor="sql-query" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="btn btn-primary flex items-center"
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

          {queryResult && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                  Query Results
                </h2>
                {queryResult.success && queryResult.data.length > 0 && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm flex items-center text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy JSON
                      </>
                    )}
                  </button>
                )}
              </div>

              {queryResult.error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">Query Error</p>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">{queryResult.error}</p>
                    </div>
                  </div>
                </div>
              ) : queryResult.data.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No results found for this query
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                        <tr key={rowIndex}>
                          {Object.keys(row).map((key) => (
                            <td key={`${rowIndex}-${key}`}>
                              {row[key] === null ? (
                                <span className="text-slate-400 dark:text-slate-500 italic">null</span>
                              ) : typeof row[key] === 'object' ? (
                                JSON.stringify(row[key])
                              ) : (
                                String(row[key])
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {queryResult.success && queryResult.data.length > 0 && (
                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  {queryResult.data.length} record{queryResult.data.length === 1 ? '' : 's'} returned
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              Example Queries
            </h2>
            <div className="space-y-3">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => selectQuery(example.query)}
                  className="w-full text-left p-3 text-sm rounded-md bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  {example.name}
                </button>
              ))}
            </div>
            
            <h3 className="text-md font-medium text-slate-900 dark:text-white mt-6 mb-2">
              Schema Reference
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono whitespace-pre-wrap">
              {`CREATE TABLE patients (
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
  created_at TIMESTAMP
);`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientQuery;
