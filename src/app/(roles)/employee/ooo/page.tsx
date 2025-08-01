"use client";

import { Header } from "@/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Clock, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { oooApi, type OOORequest } from "@/app/shared/server/ooo";

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
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    reset,
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

  // Load existing OOO status on component mount
  useEffect(() => {
    const loadOOOStatus = async () => {
      if (!session?.user?.email) return;

      try {
        setIsLoading(true);
        const response = await oooApi.getOOOStatus(session.user.email);

        if (response.ooo) {
          const oooData = response.ooo;
          const formData = {
            active: oooData.active,
            startDate: oooData.startDate,
            endDate: oooData.endDate,
            reason: oooData.reason,
            message: oooData.message,
            emergencyContact: oooData.emergencyContact || "",
          };

          setCurrentStatus(formData);
          reset(formData);
        }
      } catch (error) {
        console.error("Error loading OOO status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOOOStatus();
  }, [session?.user?.email, reset]);

  const onSubmit = async (data: OOOForm) => {
    if (!session?.user?.email || !session?.user?.name) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const oooRequest: OOORequest = {
        ...data,
        userName: session.user.name,
        userEmail: session.user.email,
      };

      console.log('OOO Request Data:', oooRequest);
      console.log('Session User:', { name: session.user.name, email: session.user.email });

      await oooApi.updateOOOStatus(oooRequest);
      setCurrentStatus(data);

      toast.success(
        data.active
          ? "OOO status activated successfully!"
          : "OOO status deactivated successfully!"
      );
    } catch (error) {
      console.error("Error updating OOO status:", error);
      toast.error(
        error instanceof Error ? error.message : "Error updating OOO status"
      );
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading OOO status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Out of Office Status
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your availability and let colleagues know when you're away.
          </p>
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
      </div>
    </div>
  );
}
