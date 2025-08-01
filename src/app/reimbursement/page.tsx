"use client";

import { Header } from "@/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Receipt, Upload, Plus, Trash2 } from "lucide-react";

const reimbursementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(10, "Description must have at least 10 characters"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  attachments: z.array(z.any()).optional(),
});

type ReimbursementForm = z.infer<typeof reimbursementSchema>;

export default function ReimbursementPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReimbursementForm>({
    resolver: zodResolver(reimbursementSchema),
  });

  const onSubmit = async (data: ReimbursementForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Reimbursement submitted successfully!");
      reset();
      setAttachments([]);
    } catch (error) {
      alert("Error submitting reimbursement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const categories = [
    "Food",
    "Transportation",
    "Accommodation",
    "Office Supplies",
    "Training",
    "Others",
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
              Fill out the form below to request your reimbursement
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
              >
                Request Title *
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                placeholder="Ex: Client lunch reimbursement"
              />
              {errors.title && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
              >
                Description *
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                placeholder="Describe in detail the reason for the reimbursement..."
              />
              {errors.description && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Amount and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                >
                  Amount ($) *
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
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
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                >
                  Category *
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
              >
                Expense Date *
              </label>
              <input
                type="date"
                id="date"
                {...register("date")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              />
              {errors.date && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Attachments (Receipts)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors duration-300">
                <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                      Click to upload
                    </span>
                    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      PNG, JPG, PDF up to 10MB
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {/* File list */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md transition-colors duration-300"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
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
