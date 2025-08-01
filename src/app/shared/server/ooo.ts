import axios from 'axios';

// Types for OOO data
export interface OOORequest {
  active: boolean;
  startDate: string;
  endDate: string;
  reason: string;
  message: string;
  emergencyContact?: string;
  userName: string;
  userEmail: string;
}

export interface OOOResponse {
  message: string;
  ooo: {
    id: string;
    userName: string;
    userEmail: string;
    active: boolean;
    startDate: string;
    endDate: string;
    reason: string;
    message: string;
    emergencyContact: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// API client configuration
const createApiClient = () => {
  const headers: Record<string, string> = {};

  const apiClient = axios.create({
    baseURL: 'http://localhost:4000',
    headers,
    timeout: 30000,
  });

  // Add request interceptor for logging
  apiClient.interceptors.request.use(
    (config) => {
      console.log('OOO API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('OOO API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for logging
  apiClient.interceptors.response.use(
    (response) => {
      console.log('OOO API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('OOO API Response Error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// OOO API functions
export const oooApi = {
  /**
   * Create or update OOO status
   * @param data - OOO data
   * @returns Promise with the response from the backend
   */
  updateOOOStatus: async (data: OOORequest): Promise<OOOResponse> => {
    try {
      const apiClient = createApiClient();
      
      const payload = {
        active: data.active,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        message: data.message,
        emergencyContact: data.emergencyContact || null,
        userName: data.userName,
        userEmail: data.userEmail,
      };

      console.log('OOO Payload being sent:', payload);
      
      const response = await apiClient.post<OOOResponse>('/ooo', payload);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating OOO status:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update OOO status');
      }
      throw error;
    }
  },

  /**
   * Get OOO status for the current user
   * @param userEmail - User email to get OOO status for
   * @returns Promise with OOO status
   */
  getOOOStatus: async (userEmail: string) => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get(`/ooo/${encodeURIComponent(userEmail)}`);
      return {
        ooo: response.data.ooo || response.data || null
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching OOO status:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch OOO status');
      }
      throw error;
    }
  },

  /**
   * Get all OOO statuses (admin view)
   * @returns Promise with all OOO statuses list
   */
  getAllOOOStatuses: async () => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get('/ooo');
      const data = response.data.ooo || response.data.oooStatuses || response.data || [];
      // Ensure we always return an array
      const oooStatuses = Array.isArray(data) ? data : [];
      return {
        oooStatuses
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching all OOO statuses:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch all OOO statuses');
      }
      throw error;
    }
  },

  /**
   * Delete OOO status
   * @param userEmail - User email to delete OOO status for
   * @returns Promise with success message
   */
  deleteOOOStatus: async (userEmail: string) => {
    try {
      const apiClient = createApiClient();
      const response = await apiClient.delete(`/ooo/${encodeURIComponent(userEmail)}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error deleting OOO status:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to delete OOO status');
      }
      throw error;
    }
  },
};

export default oooApi;