"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export type UserRole = "admin" | "employee";

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [currentRole, setCurrentRole] = useState<UserRole>("employee");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // Always start with employee role - user can switch via RoleSwitcher
      setCurrentRole("employee");
    }
    setIsLoading(false);
  }, [session]);

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
