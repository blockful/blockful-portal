"use client";

import { Header } from "@/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Receipt, Upload, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { reimbursementsApi, ReimbursementRequest } from "@/app/shared/server/reimbursements";

const reimbursementSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  currency: z.string(),
  description: z.string().optional(),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  file: z.instanceof(File, { message: "Please select a file" }),
});

type ReimbursementForm = z.infer<typeof reimbursementSchema>;

export default function ReimbursementPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
    },
  });

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
      setValue('file', file);
      setMessage(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValue('file', undefined as any);
  };

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "BRL", name: "Brazilian Real" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Request Reimbursement
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
              Upload your invoice and submit a reimbursement request
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

              {errors.file && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                  {errors.file.message}
                </p>
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
        </div>
      </main>
    </div>
  );
}
