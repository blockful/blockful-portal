"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Github, Mail, Loader2, Shield, Users } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/employee";

  // Debug: log the callbackUrl
  console.log("CallbackUrl:", callbackUrl);

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);
    setProvider(provider);

    try {
      // Use automatic redirect instead of manual handling
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      setIsLoading(false);
      setProvider(null);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Segurança Avançada",
      description: "Autenticação segura com múltiplos provedores",
    },
    {
      icon: Users,
      title: "Gestão de Roles",
      description: "Controle de acesso baseado em permissões",
    },
    {
      icon: Mail,
      title: "Integração Corporativa",
      description: "Login com contas Google",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bem-vindo ao GateFul
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Faça login para acessar sua conta. Use seu email @blockful.io
              </p>
            </div>

            {/* Login Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => handleSignIn("google")}
                disabled={isLoading}
                className="cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading && provider === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>

              <button
                onClick={() => handleSignIn("github")}
                disabled={isLoading}
                className="cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading && provider === "github" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Github className="w-5 h-5 mr-2" />
                    Continuar com GitHub
                  </>
                )}
              </button>
            </div>

            {/* Callback URL Info */}
            {callbackUrl && callbackUrl !== "/employee" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Redirecionamento:</strong> Após o login, você será
                  direcionado para a página que tentou acessar.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="max-w-lg px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-8">
                GateFul Portal
              </h3>
              <p className="text-blue-100 mb-12 text-lg">
                Acesse todas as ferramentas e recursos da sua organização em um
                só lugar.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {feature.title}
                      </h4>
                      <p className="text-blue-100">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-blue-100 text-sm">
                © 2024 GateFul. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
