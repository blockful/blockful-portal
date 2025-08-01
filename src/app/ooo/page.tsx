"use client";

import { Header } from "@/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Clock, MessageSquare } from "lucide-react";

const oooSchema = z.object({
  active: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason is required"),
  message: z.string().min(10, "Message must have at least 10 characters"),
  emergencyContact: z.string().optional(),
});

type OOOForm = z.infer<typeof oooSchema>;

export default function OOOPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OOOForm>({
    active: false,
    startDate: "",
    endDate: "",
    reason: "",
    message: "",
    emergencyContact: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OOOForm>({
    resolver: zodResolver(oooSchema),
    defaultValues: {
      active: false,
      startDate: "",
      endDate: "",
      reason: "",
      message: "",
      emergencyContact: "",
    },
  });

  const isActive = watch("active");

  const onSubmit = async (data: OOOForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStatus(data);
      alert(
        data.active
          ? "OOO status activated successfully!"
          : "OOO status deactivated successfully!"
      );
    } catch (error) {
      alert("Error updating OOO status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = () => {
    setValue("active", !isActive);
  };

  const reasons = [
    "Vacation",
    "Sick Leave",
    "Business Trip",
    "Training",
    "Personal",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 mb-6 transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  OOO Status
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Current Status:
                </span>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                    currentStatus.active
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  }`}
                >
                  {currentStatus.active ? "OOO Active" : "Available"}
                </div>
              </div>
            </div>
          </div>

          {currentStatus.active && (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-red-400 dark:text-red-300" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200 transition-colors duration-300">
                    OOO Status Active
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300 transition-colors duration-300">
                    <p>
                      <strong>Period:</strong> {currentStatus.startDate} to{" "}
                      {currentStatus.endDate}
                    </p>
                    <p>
                      <strong>Reason:</strong> {currentStatus.reason}
                    </p>
                    <p>
                      <strong>Message:</strong> {currentStatus.message}
                    </p>
                    {currentStatus.emergencyContact && (
                      <p>
                        <strong>Emergency Contact:</strong>{" "}
                        {currentStatus.emergencyContact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Configuration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Configure OOO Status
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Toggle Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                  Activate OOO Status
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  When activated, you will appear as unavailable to colleagues
                </p>
              </div>
              <button
                type="button"
                onClick={toggleStatus}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {isActive && (
              <>
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                    >
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      {...register("startDate")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                    {errors.startDate && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                    >
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      {...register("endDate")}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                    {errors.endDate && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Reason *
                  </label>
                  <select
                    id="reason"
                    {...register("reason")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                  >
                    <option value="">Select a reason</option>
                    {reasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                  {errors.reason && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                      {errors.reason.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Message for Colleagues *
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="Ex: I will be away on vacation. For urgent matters, please contact..."
                  />
                  {errors.message && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 transition-colors duration-300">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label
                    htmlFor="emergencyContact"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    Emergency Contact (Optional)
                  </label>
                  <input
                    type="text"
                    id="emergencyContact"
                    {...register("emergencyContact")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    placeholder="Name and contact of someone who can help in emergencies"
                  />
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isSubmitting
                  ? "Saving..."
                  : isActive
                  ? "Activate OOO"
                  : "Deactivate OOO"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
