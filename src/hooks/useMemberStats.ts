"use client";

import { useState, useEffect } from "react";
import { GitHubMember } from "./useGitHubMembers";

export interface MemberStats {
  member: GitHubMember;
  reimbursements: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  ooo: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
  };
}

interface UseMemberStatsReturn {
  memberStats: MemberStats[];
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

export function useMemberStats(members: GitHubMember[]): UseMemberStatsReturn {
  const [memberStats, setMemberStats] = useState<MemberStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMockStats = (member: GitHubMember): MemberStats => {
    // Gerar dados mock baseados no ID do membro para consistência
    const seed = member.id;

    return {
      member,
      reimbursements: {
        total: (seed % 10) + 1,
        pending: (seed % 3) + 1,
        approved: Math.floor((seed % 8) / 2) + 1,
        rejected: Math.floor((seed % 4) / 3),
      },
      ooo: {
        total: (seed % 5) + 1,
        active: seed % 2,
        upcoming: (seed % 3) + 1,
        completed: Math.floor((seed % 4) / 2),
      },
    };
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Gerar estatísticas mock para cada membro
      const stats = members.map(generateMockStats);
      setMemberStats(stats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar estatísticas";
      setError(errorMessage);
      console.error("Erro ao buscar estatísticas dos membros:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    await fetchStats();
  };

  useEffect(() => {
    if (members.length > 0) {
      fetchStats();
    }
  }, [members]);

  return {
    memberStats,
    loading,
    error,
    refreshStats,
  };
}
