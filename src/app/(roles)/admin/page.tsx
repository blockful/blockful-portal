"use client";
import {
  Users,
  BarChart3,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Receipt,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useGitHubMembers } from "@/hooks/useGitHubMembers";
import { useMemberStats } from "@/hooks/useMemberStats";

export default function AdminDashboard() {
  const {
    members,
    loading: membersLoading,
    error: membersError,
  } = useGitHubMembers({
    org: "blockful",
    autoFetch: true,
  });

  const {
    memberStats,
    loading: statsLoading,
    error: statsError,
    refreshStats,
  } = useMemberStats(members);

  // Calcular estatísticas gerais
  const totalReimbursements = memberStats.reduce(
    (sum, stat) => sum + stat.reimbursements.total,
    0
  );
  const pendingReimbursements = memberStats.reduce(
    (sum, stat) => sum + stat.reimbursements.pending,
    0
  );
  const totalOOO = memberStats.reduce((sum, stat) => sum + stat.ooo.total, 0);
  const activeOOO = memberStats.reduce((sum, stat) => sum + stat.ooo.active, 0);

  const adminStats = [
    {
      label: "Total Members",
      value: members.length.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Reimbursements",
      value: totalReimbursements.toString(),
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Pending Approvals",
      value: pendingReimbursements.toString(),
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "Active OOO",
      value: activeOOO.toString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentActivities = [
    {
      action: "Reimbursement approved",
      user: "john.doe@blockful.io",
      time: "2 minutes ago",
      status: "success",
    },
    {
      action: "OOO request submitted",
      user: "jane.smith@blockful.io",
      time: "15 minutes ago",
      status: "success",
    },
    {
      action: "Reimbursement rejected",
      user: "mike.wilson@blockful.io",
      time: "1 hour ago",
      status: "warning",
    },
    {
      action: "New member joined",
      user: "System",
      time: "2 hours ago",
      status: "success",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            System overview and management
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Admin Access</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.bgColor} dark:bg-gray-700 p-3 rounded-lg`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Estatísticas por Membro
          </h3>
          <button
            onClick={refreshStats}
            disabled={statsLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`}
            />
            <span>Atualizar</span>
          </button>
        </div>

        {statsLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : statsError ? (
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{statsError}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Membro
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Reimbursements
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    OOO
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {memberStats.map((stat) => (
                  <tr
                    key={stat.member.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={stat.member.avatar_url}
                          alt={stat.member.login}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {stat.member.name || stat.member.login}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{stat.member.login}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {stat.reimbursements.total}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            total
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-4 text-xs">
                          <span className="text-green-600 dark:text-green-400">
                            {stat.reimbursements.approved} aprovados
                          </span>
                          <span className="text-yellow-600 dark:text-yellow-400">
                            {stat.reimbursements.pending} pendentes
                          </span>
                          <span className="text-red-600 dark:text-red-400">
                            {stat.reimbursements.rejected} rejeitados
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {stat.ooo.total}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            total
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-4 text-xs">
                          <span className="text-blue-600 dark:text-blue-400">
                            {stat.ooo.active} ativos
                          </span>
                          <span className="text-purple-600 dark:text-purple-400">
                            {stat.ooo.upcoming} futuros
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {stat.ooo.completed} concluídos
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col space-y-1">
                        {stat.reimbursements.pending > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Reembolso pendente
                          </span>
                        )}
                        {stat.ooo.active > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            OOO ativo
                          </span>
                        )}
                        {stat.reimbursements.pending === 0 &&
                          stat.ooo.active === 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Em dia
                            </span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Database</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 text-sm">
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Authentication
              </span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 text-sm">
                  Active
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                API Services
              </span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 text-sm">
                  Running
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`p-1 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                  }`}
                >
                  {activity.status === "success" ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
