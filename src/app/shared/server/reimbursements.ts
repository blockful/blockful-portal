import axios from 'axios';

// Types for reimbursement data
export interface ReimbursementRequest {
  amount: string;
  currency?: string;
  description?: string;
  invoiceDate: string;
  userName: string;
  userEmail: string;
  userAddress?: string;
  file: File;
}

export interface ReimbursementResponse {
  message: string;
  reimbursement: {
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
  };
}

// API client configuration
const createApiClient = (accessToken?: string) => {
  const headers: Record<string, string> = {};

  // Add authorization header if access token is provided
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const apiClient = axios.create({
    baseURL: 'http://localhost:4000',
    headers,
    timeout: 30000, // 30 second timeout for file uploads
  });

  // Add request interceptor for logging
  apiClient.interceptors.request.use(
    (config) => {
      console.log('Reimbursement API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('Reimbursement API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for logging
  apiClient.interceptors.response.use(
    (response) => {
      console.log('Reimbursement API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('Reimbursement API Response Error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Reimbursements API functions
export const reimbursementsApi = {
  /**
   * Create a new reimbursement request
   * @param data - Reimbursement data including file
   * @param accessToken - Optional access token for authentication
   * @returns Promise with the response from the backend
   */
  createReimbursement: async (data: ReimbursementRequest, accessToken?: string): Promise<ReimbursementResponse> => {
    try {
      const apiClient = createApiClient(accessToken);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('amount', data.amount);
      formData.append('currency', data.currency || 'USD');
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('invoiceDate', data.invoiceDate);
      formData.append('userName', data.userName);
      formData.append('userEmail', data.userEmail);
      if (data.userAddress) {
        formData.append('userAddress', data.userAddress);
      }
      formData.append('file', data.file);

      const response = await apiClient.post<ReimbursementResponse>('/reimbursements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating reimbursement:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to create reimbursement request');
      }
      throw error;
    }
  },

  /**
   * Get reimbursements for the current user
   * @param accessToken - Optional access token for authentication
   * @returns Promise with reimbursements list
   */
  getReimbursements: async (accessToken?: string) => {
    try {
      const apiClient = createApiClient(accessToken);
      const response = await apiClient.get('/reimbursements');
      return {
        reimbursements: response.data.reimbursements || response.data || []
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching reimbursements:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch reimbursements');
      }
      throw error;
    }
  },

  /**
   * Get all reimbursements (admin view)
   * @param accessToken - Optional access token for authentication
   * @returns Promise with all reimbursements list
   */
  getAllReimbursements: async (accessToken?: string) => {
    try {
      const apiClient = createApiClient(accessToken);
      const response = await apiClient.get('/reimbursements');
      return {
        reimbursements: response.data.reimbursements || response.data || []
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching all reimbursements:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch all reimbursements');
      }
      throw error;
    }
  },
};

export default reimbursementsApi; 