import React, { useState } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { registerPatient } from '../services/DatabaseService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  medical_notes: string;
  insurance_provider: string;
  insurance_id: string;
}

const initialFormData: PatientFormData = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  medical_notes: '',
  insurance_provider: '',
  insurance_id: '',
};

const PatientRegistration: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<PatientFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof PatientFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};
    
    // Required fields
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Phone validation
    if (formData.phone && !/^[0-9+\-\s()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !isInitialized) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await registerPatient(formData);
      setSubmitStatus({
        success: true,
        message: 'Patient registered successfully!'
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error registering patient:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to register patient. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Register New Patient</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Add a new patient to the healthcare system
        </p>
      </header>

      {submitStatus && (
        <div className={`mb-6 p-4 rounded-md ${
          submitStatus.success 
            ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
            : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {submitStatus.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                submitStatus.success 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {submitStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
          <h2 className="text-xl font-medium text-slate-900 dark:text-white">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="form-group">
            <label htmlFor="first_name" className="form-label">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`form-input ${errors.first_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="last_name" className="form-label">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`form-input ${errors.last_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label htmlFor="date_of_birth" className="form-label">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className={`form-input ${errors.date_of_birth ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.date_of_birth && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date_of_birth}</p>
            )}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="gender" className="form-label">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`form-input ${errors.gender ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gender}</p>
            )}
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4 pt-4">
          <h2 className="text-xl font-medium text-slate-900 dark:text-white">Contact Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g. (123) 456-7890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="form-group md:col-span-2">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              placeholder="Street address, city, state, zip"
            />
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4 pt-4">
          <h2 className="text-xl font-medium text-slate-900 dark:text-white">Medical Information</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Medical Notes */}
          <div className="form-group">
            <label htmlFor="medical_notes" className="form-label">Medical Notes</label>
            <textarea
              id="medical_notes"
              name="medical_notes"
              value={formData.medical_notes}
              onChange={handleChange}
              rows={4}
              className="form-input"
              placeholder="Any important medical information, allergies, etc."
            />
          </div>

          {/* Insurance Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="insurance_provider" className="form-label">Insurance Provider</label>
              <input
                type="text"
                id="insurance_provider"
                name="insurance_provider"
                value={formData.insurance_provider}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="insurance_id" className="form-label">Insurance ID</label>
              <input
                type="text"
                id="insurance_id"
                name="insurance_id"
                value={formData.insurance_id}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setFormData(initialFormData)}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Registering...
              </>
            ) : (
              'Register Patient'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;