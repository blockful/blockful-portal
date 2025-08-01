import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usersApi, CreateUserRequest } from '@/app/shared/server/users';

export const useUserSync = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const syncUserToBackend = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          console.log('Syncing user to backend:', session.user);
          
          // Get access token from session
          const accessToken = session.accessToken;
          console.log('Using access token:', accessToken ? 'Available' : 'Not available');
          
          // Test backend connection first
          const isConnected = await usersApi.testConnection(accessToken);
          if (!isConnected) {
            console.warn('Backend is not available, skipping user sync');
            return;
          }
          
          // Check if user already exists in backend
          const existingUser = await usersApi.getUserByEmail(session.user.email!, accessToken);
          
          if (!existingUser) {
            // Create new user in backend
            const userData: CreateUserRequest = {
              name: session.user.name || '',
              email: session.user.email || '',
              image: session.user.image || '',
              // Add Google ID if available (works for both Google and GitHub providers)
              ...(session.user.id && { 
                googleId: session.user.id
              }),
            };

            console.log('Creating user in backend with data:', userData);
            const response = await usersApi.createUser(userData, accessToken);
            console.log('User created successfully in backend:', response);
          } else {
            // User exists, could update if needed
            console.log('User already exists in backend:', existingUser);
            
            // Optionally update user data if needed
            // const updatedUser = await usersApi.updateUser(session.user.email!, {
            //   name: session.user.name || existingUser.name,
            //   image: session.user.image || existingUser.image,
            // }, accessToken);
            // console.log('User updated in backend:', updatedUser);
          }
        } catch (error) {
          console.error('Error syncing user to backend:', error);
          // You might want to show a toast notification here
        }
      }
    };

    if (status === 'authenticated') {
      syncUserToBackend();
    }
  }, [session, status]);

  return { session, status };
}; 