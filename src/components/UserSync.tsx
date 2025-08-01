"use client";

import { useUserSync } from '@/hooks/useUserSync';

export const UserSync = () => {
  // This component doesn't render anything, it just handles user syncing
  useUserSync();
  
  return null;
}; 