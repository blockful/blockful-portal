import { Header } from "@/components/Header";
import { Receipt, MessageSquare, Bell, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const quickActions = [
    {
      title: "Request Reimbursement",
      description: "Submit new reimbursement request",
      icon: Receipt,
      href: "/reembolso",
      color: "bg-blue-500",
    },
    {
      title: "Configure OOO",
      description: "Set absence period",
      icon: MessageSquare,
      href: "/ooo",
      color: "bg-green-500",
    },
    {
      title: "View News",
      description: "Latest company news",
      icon: Bell,
      href: "/news",
      color: "bg-purple-500",
    },
    {
      title: "Calendar",
      description: "View meetings and events",
      icon: Calendar,
      href: "/calendar",
      color: "bg-orange-500",
    },
  ];

  const stats = [
    { label: "Pending Reimbursements", value: "3", icon: Clock },
    { label: "Unread Messages", value: "7", icon: MessageSquare },
    { label: "Today's Meetings", value: "2", icon: Calendar },
    { label: "Recent News", value: "5", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Welcome to the Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
            Manage your requests and stay updated with company news
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/30"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center mb-4">
                      <div
                        className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Receipt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    Reimbursement approved
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Your reimbursement request was approved
                  </p>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
                  2h ago
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    New news published
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Check out the latest company updates
                  </p>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
                  4h ago
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    Meeting scheduled
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Team meeting tomorrow at 10am
                  </p>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
                  1 day ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
