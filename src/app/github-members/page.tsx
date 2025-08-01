"use client";

import { Header } from "@/components/Header";
import { GitHubMembers } from "@/components/GitHubMembers";
import { useState } from "react";
import { Github, Settings } from "lucide-react";

export default function GitHubMembersPage() {
  const [organization, setOrganization] = useState("blockful");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Github className="h-8 w-8 text-gray-900 dark:text-white" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              GitHub Members
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Visualize e gerencie membros de organizações do GitHub. Busque por
            nome, username ou empresa, e veja detalhes completos de cada membro.
          </p>
        </div>

        {/* Organization Selector */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configurações
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="organization"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Organização:
              </label>
              <input
                id="organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Nome da organização"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Ex: microsoft, google, facebook
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Members Component */}
        <GitHubMembers organization={organization} />
      </main>
    </div>
  );
}
