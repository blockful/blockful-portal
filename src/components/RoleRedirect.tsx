"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRole } from "@/contexts/RoleContext";

export function RoleRedirect() {
  const { data: session, status } = useSession();
  const { currentRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // Se não está logado, redireciona para login
      return;
    }

    // Redireciona baseado no role atual
    const currentPath = window.location.pathname;

    // Se está na raiz, redireciona para o dashboard do role
    if (currentPath === "/") {
      router.push(`/${currentRole}`);
      return;
    }

    // Se está em uma rota específica de role, verifica se é o role correto
    const roleFromPath = currentPath.split("/")[1];
    const validRoles = ["admin", "employee"];

    if (validRoles.includes(roleFromPath) && roleFromPath !== currentRole) {
      // Se o role na URL não corresponde ao role atual, redireciona
      router.push(`/${currentRole}`);
    }
  }, [session, status, currentRole, router]);

  // Efeito adicional para garantir que a rota seja atualizada quando o role muda
  useEffect(() => {
    if (status === "loading" || !session) return;

    const currentPath = window.location.pathname;
    const roleFromPath = currentPath.split("/")[1];
    const validRoles = ["admin", "employee"];

    // Se estamos em uma rota válida mas não corresponde ao role atual
    if (validRoles.includes(roleFromPath) && roleFromPath !== currentRole) {
      router.push(`/${currentRole}`);
    }
  }, [currentRole, session, status, router]);

  return null;
}
