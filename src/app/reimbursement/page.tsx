"use client";

import { Header } from "@/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Receipt, Upload, Trash2, AlertCircle, CheckCircle, Plus, List, Calendar, DollarSign, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import { reimbursementsApi, ReimbursementRequest } from "@/app/shared/server/reimbursements";

const reimbursementSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  currency: z.string(),
  description: z.string().optional(),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  userName: z.string().min(1, "Name is required"),
  userEmail: z.string().email("Invalid email format"),
  userAddress: z.string().optional(),
});

type ReimbursementForm = z.infer<typeof reimbursementSchema>;

interface ReimbursementItem {
  id: string;
  userName: string;
  userEmail: string;
  userAddress: string | null;
  amount: number;
  currency: string;
  description: string | null;
  invoiceDate: string;
  status: string;
  fileName: string;
  createdAt: string;
}

export default function ReimbursementPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'submit' | 'list'>('submit');
  const [reimbursements, setReimbursements] = useState<ReimbursementItem[]>([]);
  const [isLoadingReimbursements, setIsLoadingReimbursements] = useState(false);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReimbursementForm>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      currency: "USD",
      userName: session?.user?.name || "",
      userEmail: session?.user?.email || "",
    },
  });

  // Load reimbursements when tab changes or session changes
  useEffect(() => {
    if (activeTab === 'list' && session?.accessToken) {
      loadReimbursements();
    }
  }, [activeTab, session?.accessToken]);

  const loadReimbursements = async () => {
    if (!session?.accessToken) return;
    
    setIsLoadingReimbursements(true);
    try {
      const response = await reimbursementsApi.getAllReimbursements(session.accessToken);
      setReimbursements(response.reimbursements || []);
    } catch (error: any) {
      console.error('Error loading reimbursements:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to load reimbursements' 
      });
    } finally {
      setIsLoadingReimbursements(false);
    }
  };

  const onSubmit = async (data: ReimbursementForm) => {
    if (!session?.accessToken) {
      setMessage({ type: 'error', text: 'Please log in to submit a reimbursement request' });
      return;
    }

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const reimbursementData: ReimbursementRequest = {
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        invoiceDate: data.invoiceDate,
        userName: data.userName,
        userEmail: data.userEmail,
        userAddress: data.userAddress,
        file: selectedFile,
      };

      const response = await reimbursementsApi.createReimbursement(
        reimbursementData,
        session.accessToken
      );

      setMessage({ 
        type: 'success', 
        text: `Reimbursement submitted successfully! Request ID: ${response.reimbursement.id}` 
      });
      reset();
      setSelectedFile(null);
      
      // Reload reimbursements list
      await loadReimbursements();
    } catch (error: any) {
      console.error('Error submitting reimbursement:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to submit reimbursement request' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('image/')) {
        setMessage({ type: 'error', text: 'Please select a PDF or image file' });
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 10MB' });
        return;
      }

      setSelectedFile(file);
      setMessage(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "BRL", name: "Brazilian Real" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Reimbursements
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
              Submit new requests or view your existing reimbursements
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('submit')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                  activeTab === 'submit'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Submit Request</span>
                </div>
              </button>
                             <button
                 onClick={() => setActiveTab('list')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                   activeTab === 'list'
                     ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                 }`}
               >
                 <div className="flex items-center space-x-2">
                   <List className="h-4 w-4" />
                   <span>All Reimbursements</span>
                 </div>
               </button>
            </nav>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mx-6 mt-4 p-4 rounded-md flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {/* Submit Request Tab */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Amount and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Amount *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    {...register("amount")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    {...register("currency")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Invoice Date */}
              <div>
                <label
                  htmlFor="invoiceDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                >
                  Invoice Date *
                </label>
                <input
                  type="date"
                  id="invoiceDate"
                  {...register("invoiceDate")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
                {errors.invoiceDate && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                    {errors.invoiceDate.message}
                  </p>
                )}
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="userName"
                    {...register("userName")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="Your full name"
                  />
                  {errors.userName && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                      {errors.userName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="userEmail"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    {...register("userEmail")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                  {errors.userEmail && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                      {errors.userEmail.message}
                    </p>
                  )}
                </div>
              </div>

              {/* User Address */}
              <div>
                <label
                  htmlFor="userAddress"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                >
                  Address (Optional)
                </label>
                <textarea
                  id="userAddress"
                  {...register("userAddress")}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  placeholder="Your address for reimbursement"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  placeholder="Describe the expense or provide additional context..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Invoice File *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors duration-300">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                        Click to upload invoice
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        PDF, PNG, JPG up to 10MB
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                {/* Selected file display */}
                {selectedFile && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setSelectedFile(null);
                    setMessage(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !session?.accessToken}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          )}

          {/* My Requests Tab */}
          {activeTab === 'list' && (
            <div className="p-6">
              {isLoadingReimbursements ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : reimbursements.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No reimbursements found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No reimbursement requests have been submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reimbursements.map((reimbursement) => (
                    <div
                      key={reimbursement.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition-colors duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {reimbursement.userName}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reimbursement.status)}`}>
                              {reimbursement.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {formatCurrency(reimbursement.amount, reimbursement.currency)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {formatDate(reimbursement.invoiceDate)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {reimbursement.fileName}
                              </span>
                            </div>
                          </div>
                          
                          {reimbursement.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {reimbursement.description}
                            </p>
                          )}
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Submitted on {formatDate(reimbursement.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
