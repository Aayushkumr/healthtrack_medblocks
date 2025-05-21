import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatabaseContext } from '../context/DatabaseContext';
import { getAllPatients, searchPatientsByName } from '../services/DatabaseService';
import { Users, UserPlus, Search, Mail, Phone, Database } from 'lucide-react';
import LoadingState from '../components/LoadingState.tsx';
import EmptyState from '../components/EmptyState.tsx';

/* eslint-disable @typescript-eslint/no-explicit-any */
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

  useEffect(() => {
    const loadPatients = async () => {
      if (!isInitialized) return;
      
      setIsLoading(true);
      try {
        const data = await getAllPatients();
        setPatients(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load patients:', err);
        setError(err.message || 'Failed to load patients');
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, [isInitialized]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!isInitialized) return;
    
    if (value.trim() === '') {
      // If search is cleared, load all patients
      const allPatients = await getAllPatients();
      setPatients(allPatients);
      return;
    }
    
    try {
      setIsLoading(true);
      const results = await searchPatientsByName(value);
      setPatients(results);
      setError(null);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search patients');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return dateString;
    }
  };

  if (!isInitialized) {
    return (
      <div className="page-transition">
        <header className="page-header">
          <h1 className="page-title">Patient List</h1>
          <p className="page-subtitle">View and manage all registered patients</p>
        </header>
        
        <EmptyState
          icon={<Database className="h-12 w-12" />}
          title="Database Initializing"
          description="Please wait while the database is being initialized."
        />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="page-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="page-title">Patient List</h1>
            <p className="page-subtitle">View and manage all registered patients</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/register" className="btn btn-primary btn-icon">
              <UserPlus className="mr-2 h-4 w-4" />
              Register New Patient
            </Link>
          </div>
        </div>
      </header>

      <div className="card mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search patients by name..."
            className="form-input pl-10"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-red-800 dark:text-red-300 font-medium">Error</h3>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Loading patients..." />
      ) : (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="table-container">
              {patients.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-12 w-12" />}
                  title={searchTerm ? "No matching patients found" : "No patients registered yet"}
                  description={searchTerm 
                    ? `No patients found matching "${searchTerm}"`
                    : "Register a new patient to get started"}
                  action={
                    !searchTerm && (
                      <Link to="/register" className="btn btn-primary btn-icon">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register First Patient
                      </Link>
                    )
                  }
                />
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="rounded-tl-lg">ID</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Date of Birth</th>
                      <th>Contact</th>
                      <th>Insurance</th>
                      <th className="rounded-tr-lg">Registered</th>
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
                        <td>
                          <span className={`status-badge ${
                            patient.gender === 'Male' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            patient.gender === 'Female' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}>
                            {patient.gender}
                          </span>
                        </td>
                        <td>{formatDate(patient.date_of_birth)}</td>
                        <td>
                          <div className="space-y-1">
                            {patient.email && (
                              <div className="flex items-center text-xs">
                                <Mail className="h-3 w-3 mr-1 text-slate-400" />
                                <span>{patient.email}</span>
                              </div>
                            )}
                            {patient.phone && (
                              <div className="flex items-center text-xs">
                                <Phone className="h-3 w-3 mr-1 text-slate-400" />
                                <span>{patient.phone}</span>
                              </div>
                            )}
                            {!patient.email && !patient.phone && (
                              <span className="text-xs text-slate-400">No contact info</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {patient.insurance_provider ? (
                            <div>
                              <div className="font-medium">{patient.insurance_provider}</div>
                              {patient.insurance_id && (
                                <div className="text-xs text-slate-500">ID: {patient.insurance_id}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">No insurance</span>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;