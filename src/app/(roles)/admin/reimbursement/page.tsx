"use client";

import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Receipt, List, Calendar, DollarSign, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { reimbursementsApi } from "@/app/shared/server/reimbursements";
import { PaymentButton } from "@/components/PaymentButton";

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
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export default function AdminReimbursementPage() {
  const [reimbursements, setReimbursements] = useState<ReimbursementItem[]>([]);
  const [isLoadingReimbursements, setIsLoadingReimbursements] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  // Load reimbursements when component mounts
  useEffect(() => {
      loadReimbursements();
  }, []);

  const loadReimbursements = async () => {
    
    setIsLoadingReimbursements(true);
    try {
      const response = await reimbursementsApi.getAllReimbursements();
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
                All Reimbursements
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
              View and manage all reimbursement requests
            </p>
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
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                          {reimbursement.paymentStatus && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              reimbursement.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                                : reimbursement.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                            }`}>
                              {reimbursement.paymentStatus}
                            </span>
                          )}
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
                      
                      {/* Payment Section */}
                      <div className="ml-6 flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(reimbursement.amount, reimbursement.currency)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {reimbursement.userEmail}
                          </div>
                        </div>
                        
                        {reimbursement.status.toLowerCase() === 'approved' && (
                          <PaymentButton
                            amount={reimbursement.amount}
                            currency={reimbursement.currency}
                            recipientAddress={reimbursement.userAddress || '0x0000000000000000000000000000000000000000'}
                            reimbursementId={reimbursement.id}
                            onPaymentSuccess={() => {
                              setMessage({
                                type: 'success',
                                text: `Payment sent for reimbursement ${reimbursement.id}`
                              });
                            }}
                          />
                        )}
                        
                        {reimbursement.status.toLowerCase() !== 'approved' && (
                          <div className="space-y-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Status: {reimbursement.status}
                            </div>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const response = await fetch(`/api/reimbursements/${reimbursement.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ status: 'approved' }),
                                  });
                                  
                                  if (response.ok) {
                                    setMessage({
                                      type: 'success',
                                      text: `Reimbursement ${reimbursement.id} marked as approved`
                                    });
                                    // Reload reimbursements to reflect the change
                                    loadReimbursements();
                                  } else {
                                    setMessage({
                                      type: 'error',
                                      text: 'Failed to update reimbursement status'
                                    });
                                  }
                                } catch (error) {
                                  console.error('Error updating status:', error);
                                  setMessage({
                                    type: 'error',
                                    text: 'Failed to update reimbursement status'
                                  });
                                }
                              }}
                              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 