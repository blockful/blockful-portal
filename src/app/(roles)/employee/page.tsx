import {
  Receipt,
  MessageSquare,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Users,
} from "lucide-react";
import Link from "next/link";
import { WalletInfo } from "@/components/WalletInfo";

export default function EmployeeDashboard() {
  const employeeStats = [
    {
      label: "My Reimbursements",
      value: "2",
      icon: Receipt,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Pending Approvals",
      value: "1",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "Unread News",
      value: "3",
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Upcoming Meetings",
      value: "2",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const quickActions = [
    {
      title: "Request Reimbursement",
      description: "Submit new reimbursement request",
      icon: Receipt,
      href: "/employee/reimbursement",
      color: "bg-blue-500",
    },
    {
      title: "Set OOO Status",
      description: "Configure out of office status",
      icon: Clock,
      href: "/employee/ooo",
      color: "bg-green-500",
    },
    {
      title: "View OOO Overview",
      description: "See team status and your OOO history",
      icon: Eye,
      href: "/employee/ooo-list",
      color: "bg-purple-500",
    },
    {
      title: "GateFul News",
      description: "OOO, reimbursements, team news & alerts",
      icon: Bell,
      href: "/news",
      color: "bg-yellow-500",
    },
    {
      title: "Calendar",
      description: "View your schedule",
      icon: Calendar,
      href: "/employee/calendar",
      color: "bg-orange-500",
    },
    {
      title: "Team Members",
      description: "View team directory and contacts",
      icon: Users,
      href: "/employee/team",
      color: "bg-indigo-500",
    },
  ];

  const recentActivities = [
    {
      action: "Reimbursement submitted",
      status: "pending",
      time: "2 hours ago",
    },
    { action: "OOO status updated", status: "completed", time: "1 day ago" },
    { action: "News article read", status: "completed", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Wallet Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Crypto Wallet
        </h3>
        <WalletInfo />
      </div>

      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Here's what's happening with your account
            </p>
          </div>
          <div className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <span className="text-lg">👤</span>
            <span className="font-medium">Employee</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {employeeStats.map((stat, index) => {
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

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer group">
                  <div className="flex items-center mb-3">
                    <div
                      className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
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
                  activity.status === "completed"
                    ? "bg-green-100"
                    : "bg-yellow-100"
                }`}
              >
                {activity.status === "completed" ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
