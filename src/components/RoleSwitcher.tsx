"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { UserRole } from "@/contexts/RoleContext";

export function RoleSwitcher() {
  const { currentRole, setCurrentRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();

  const roles: { role: UserRole; name: string; color: string; icon: string }[] =
    [
      { role: "admin", name: "Administrator", color: "bg-red-500", icon: "👑" },
      { role: "employee", name: "Employee", color: "bg-gray-500", icon: "👤" },
    ];

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === currentRole) return;

    setIsChanging(true);
    setCurrentRole(newRole);
    setIsOpen(false);

    // Redirecionar para a rota correta baseada no novo role
    const targetRoute = newRole === "admin" ? "/admin" : "/employee";
    router.push(targetRoute);

    // Reset do estado de mudança após um delay
    setTimeout(() => {
      setIsChanging(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
          isChanging ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isChanging ? (
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
        ) : (
          <span className="text-lg">
            {roles.find((r) => r.role === currentRole)?.icon}
          </span>
        )}
        <span>{roles.find((r) => r.role === currentRole)?.name}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[200px]">
          {roles.map((role) => (
            <button
              key={role.role}
              onClick={() => handleRoleChange(role.role)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                currentRole === role.role ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <span className="text-lg">{role.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {role.name}
              </span>
              {currentRole === role.role && (
                <span className="ml-auto text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
