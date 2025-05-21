/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { getAllPatients, searchPatientsByName } from '../services/DatabaseService';
import { Search, FileDown, AlertCircle } from 'lucide-react';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  medical_notes: string | null;
  insurance_provider: string | null;
  insurance_id: string | null;
  created_at: string;
}

const PatientList: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result: Patient[];
      if (searchTerm) {
        result = await searchPatientsByName(searchTerm);
      } else {
        result = await getAllPatients();
      }
      setPatients(result);
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [isInitialized]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const exportPatients = () => {
    // Create a JSON blob
    const jsonData = JSON.stringify(patients, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a downloadable link
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return 'N/A';
    try {
      return new Date(isoDate).toLocaleDateString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return isoDate;
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Patient List</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              View and search all registered patients
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={exportPatients}
              disabled={patients.length === 0 || isLoading}
              className="btn btn-outline flex items-center"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>
      </header>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name..."
              className="form-input pl-10 pr-4 py-2 w-full rounded-l-md border-r-0"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary rounded-l-none"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="table-container">
          {patients.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 p-6 text-center rounded-lg shadow-md">
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm 
                  ? `No patients found matching "${searchTerm}"`
                  : "No patients have been registered yet"}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Contact</th>
                  <th>Insurance</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                    <td>{patient.id}</td>
                    <td>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {patient.first_name} {patient.last_name}
                      </div>
                    </td>
                    <td>{patient.gender}</td>
                    <td>{formatDate(patient.date_of_birth)}</td>
                    <td>
                      {patient.email ? (
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          <div>{patient.email}</div>
                          {patient.phone && <div className="mt-1">{patient.phone}</div>}
                        </div>
                      ) : patient.phone ? (
                        <div className="text-xs">{patient.phone}</div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">No contact</span>
                      )}
                    </td>
                    <td>
                      {patient.insurance_provider ? (
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          <div>{patient.insurance_provider}</div>
                          {patient.insurance_id && (
                            <div className="text-xs opacity-80 mt-1">ID: {patient.insurance_id}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">Not provided</span>
                      )}
                    </td>
                    <td className="text-xs">
                      {formatDate(patient.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Total records: {patients.length}
      </div>
    </div>
  );
};

export default PatientList;