"use client";

import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { RefreshCw } from "lucide-react";

export function RoleChangeIndicator() {
  const { currentRole } = useRole();
  const [isChanging, setIsChanging] = useState(false);
  const [previousRole, setPreviousRole] = useState(currentRole);

  useEffect(() => {
    if (previousRole !== currentRole) {
      setIsChanging(true);
      setPreviousRole(currentRole);

      // Reset após 2 segundos
      const timer = setTimeout(() => {
        setIsChanging(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentRole, previousRole]);

  if (!isChanging) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
      <RefreshCw className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Mudando para {currentRole === "admin" ? "Admin" : "Employee"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Redirecionando...
        </p>
      </div>
    </div>
  );
}
