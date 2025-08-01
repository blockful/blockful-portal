import axios from 'axios';

// Types for user data
export interface UserData {
  name: string;
  email: string;
  image: string;
  googleId?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  image: string;
  googleId?: string;
}

export interface CreateUserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture: string;
  };
}

// API client configuration
const createApiClient = (accessToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if access token is provided
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const apiClient = axios.create({
    baseURL: 'http://localhost:4000',
    headers,
    timeout: 10000, // 10 second timeout
  });

  // Add request interceptor for logging
  apiClient.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for logging
  apiClient.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('API Response Error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Users API functions
export const usersApi = {
  /**
   * Test API connection by attempting to create a test user
   * @param accessToken - Optional access token for authentication
   * @returns Promise with connection status
   */
  testConnection: async (accessToken?: string): Promise<boolean> => {
    try {
      const apiClient = createApiClient(accessToken);
      // Try to get a user that likely doesn't exist to test connection
      await apiClient.get('/users/email/test-connection@example.com');
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // 404 is expected for non-existent user, so connection is working
        return true;
      }
      console.error('Backend connection failed:', error);
      return false;
    }
  },

  /**
   * Create a new user in the backend
   * @param userData - User information from session
   * @param accessToken - Optional access token for authentication
   * @returns Promise with the response from the backend
   */
  createUser: async (userData: CreateUserRequest, accessToken?: string): Promise<CreateUserResponse> => {
    try {
      const apiClient = createApiClient(accessToken);
      const response = await apiClient.post<CreateUserResponse>('/users', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating user:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to create user');
      }
      throw error;
    }
  },

  /**
   * Get user by email
   * @param email - User's email address
   * @param accessToken - Optional access token for authentication
   * @returns Promise with user data
   */
  getUserByEmail: async (email: string, accessToken?: string): Promise<UserData | null> => {
    try {
      const apiClient = createApiClient(accessToken);
      const response = await apiClient.get<UserData>(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // User not found
      }
      throw error;
    }
  },

  /**
   * Update user information
   * @param email - User's email address
   * @param userData - Updated user information
   * @param accessToken - Optional access token for authentication
   * @returns Promise with the updated user data
   */
  updateUser: async (email: string, userData: Partial<UserData>, accessToken?: string): Promise<UserData> => {
    try {
      const apiClient = createApiClient(accessToken);
      const response = await apiClient.put<UserData>(`/users/email/${email}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating user:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update user');
      }
      throw error;
    }
  },
};

export default usersApi;
