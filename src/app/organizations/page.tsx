"use client";

import { Header } from "@/components/Header";
import { GitHubMembers } from "@/components/GitHubMembers";

export default function OrganizationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 transition-all duration-300">
          <GitHubMembers organization="blockful" />
        </div>
      </main>
    </div>
  );
}
