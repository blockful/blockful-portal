"use client";

import { useState, useEffect, useCallback } from "react";

export interface GitHubMember {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  twitter_username?: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface GitHubMembersResponse {
  members: GitHubMember[];
  pagination: PaginationInfo;
}

interface UseGitHubMembersOptions {
  org: string;
  perPage?: number;
  autoFetch?: boolean;
}

interface UseGitHubMembersReturn {
  members: GitHubMember[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  fetchMembers: (page?: number) => Promise<void>;
  refreshMembers: () => Promise<void>;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  currentPage: number;
  totalPages: number;
}

export function useGitHubMembers({
  org,
  perPage = 30,
  autoFetch = true,
}: UseGitHubMembersOptions): UseGitHubMembersReturn {
  const [members, setMembers] = useState<GitHubMember[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(
    async (page: number = 1) => {
      if (!org) {
        setError("Organization name is required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          org,
          per_page: perPage.toString(),
          page: page.toString(),
        });

        const response = await fetch(`/api/github/org-members?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch members");
        }

        const data: GitHubMembersResponse = await response.json();

        setMembers(data.members);
        setPagination(data.pagination);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Error fetching GitHub members:", err);
      } finally {
        setLoading(false);
      }
    },
    [org, perPage]
  );

  const refreshMembers = useCallback(async () => {
    if (pagination) {
      await fetchMembers(pagination.currentPage);
    } else {
      await fetchMembers(1);
    }
  }, [fetchMembers, pagination]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && org) {
      fetchMembers(1);
    }
  }, [autoFetch, org, fetchMembers]);

  return {
    members,
    pagination,
    loading,
    error,
    fetchMembers,
    refreshMembers,
    hasNextPage: pagination?.hasNext || false,
    hasPrevPage: pagination?.hasPrev || false,
    currentPage: pagination?.currentPage || 1,
    totalPages: pagination?.totalPages || 1,
  };
}
