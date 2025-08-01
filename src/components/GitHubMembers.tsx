"use client";

import { useState } from "react";
import { useGitHubMembers, GitHubMember } from "@/hooks/useGitHubMembers";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Building,
  Globe,
  Twitter,
  RefreshCw,
  AlertCircle,
  User,
  GitBranch,
  Eye,
  Heart,
} from "lucide-react";

interface GitHubMembersProps {
  organization: string;
  className?: string;
}

export function GitHubMembers({
  organization,
  className = "",
}: GitHubMembersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<GitHubMember | null>(
    null
  );

  const {
    members,
    loading,
    error,
    fetchMembers,
    refreshMembers,
    hasNextPage,
    hasPrevPage,
    currentPage,
    totalPages,
  } = useGitHubMembers({ org: organization });

  const filteredMembers = members.filter(
    (member) =>
      member.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchMembers(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      fetchMembers(currentPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 ${className}`}
      >
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Erro ao carregar membros</h2>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={refreshMembers}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Membros da Organização
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {organization}
              </p>
            </div>
          </div>
          <button
            onClick={refreshMembers}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300"
            aria-label="Atualizar membros"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[600px]">
        {/* Members List */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className="overflow-y-auto h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mb-4" />
                <p>Nenhum membro encontrado</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 ${
                    selectedMember?.id === member.id
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar_url}
                      alt={member.login}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.name || member.login}
                        </p>
                        {member.site_admin && (
                          <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{member.login}
                      </p>
                      {member.company && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {member.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage || loading}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage || loading}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <span>Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Member Details */}
        <div className="flex-1">
          {selectedMember ? (
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedMember.avatar_url}
                  alt={selectedMember.login}
                  className="w-20 h-20 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedMember.name || selectedMember.login}
                    </h2>
                    {selectedMember.site_admin && (
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    @{selectedMember.login}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <a
                      href={selectedMember.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">Ver perfil</span>
                    </a>
                  </div>
                </div>
              </div>

              {selectedMember.bio && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Biografia
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedMember.bio}
                  </p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                {selectedMember.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {selectedMember.location}
                    </span>
                  </div>
                )}
                {selectedMember.company && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {selectedMember.company}
                    </span>
                  </div>
                )}
                {selectedMember.blog && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <a
                      href={selectedMember.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Blog
                    </a>
                  </div>
                )}
                {selectedMember.twitter_username && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Twitter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <a
                      href={`https://twitter.com/${selectedMember.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      @{selectedMember.twitter_username}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                    <GitBranch className="h-4 w-4" />
                    <span className="text-sm">Repos</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedMember.public_repos}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Seguidores</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedMember.followers}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Seguindo</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedMember.following}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Membro desde:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedMember.created_at)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Última atualização:
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedMember.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Selecione um membro
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Escolha um membro para ver os detalhes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
