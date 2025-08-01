import { User, FileText, Calendar, Bell, Home } from "lucide-react";
import Link from "next/link";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const employeeNavItems = [
    { href: "/employee", label: "Dashboard", icon: Home },
    { href: "/employee/reimbursement", label: "Reimbursement", icon: FileText },
    { href: "/employee/ooo", label: "OOO", icon: Calendar },
    // { href: "/news", label: "GateFul News", icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Employee Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-500 p-3 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Employee Portal
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your workspace and tools
              </p>
            </div>
          </div>
          <RoleSwitcher />
        </div>

        {/* Employee Navigation */}
        <nav className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          {employeeNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors duration-200"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
