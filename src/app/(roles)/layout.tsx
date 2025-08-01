import { Header } from "@/components/Header";
import { RoleProvider } from "@/contexts/RoleContext";
import { AuthGuard } from "@/components/AuthGuard";

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <RoleProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header />
          {children}
        </div>
      </RoleProvider>
    </AuthGuard>
  );
}
