"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Bell,
  Calendar,
  MessageSquare,
  Receipt,
  User,
  Users,
  Activity,
  BarChart3,
  Shield,
} from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";
import { signIn, signOut, useSession } from "next-auth/react";
import { Howl } from "howler";
import Image from "next/image";
import { cn } from "@/app/shared/lib/cn";
import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";
import { RoleSwitcher } from "./RoleSwitcher";
import { WalletConnect } from "./WalletConnect";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const { currentRole } = useRole();
  const router = useRouter();

  const sounds = new Howl({
    src: ["/sounds/mixkit-gaming-lock-2848.wav"],
    volume: 0.5,
    rate: 1,
    loop: false,
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`bg-white dark:bg-gray-900 shadow-sm border-b transition-colors duration-300 ${
        currentRole === "admin"
          ? "border-red-200 dark:border-gray-700"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={currentRole === "admin" ? "/admin" : "/employee"}
              className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 hover:opacity-80"
            >
              GateFul
            </Link>
            <div className="ml-3 flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentRole === "admin"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}
              >
                {currentRole === "admin" ? "👑 Admin" : "👤 Employee"}
              </span>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <WalletConnect />
            <RoleSwitcher />
            <ThemeSwitch />
            <button
              className={cn(
                " flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
                "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                "border border-gray-200 dark:border-gray-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              )}
              onClick={() => {
                sounds.play();
                router.push("/news");
              }}
            >
              <Bell />
            </button>
            {status === "loading" ? (
              <div className="animate-pulse w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                <div>
                  <Image
                    src={session.user?.image ?? ""}
                    alt={session.user?.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col gp-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user?.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {currentRole}
                  </span>
                </div>
                <button
                  onClick={() => {
                    sounds.play();
                    signOut();
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.play();
                  signIn(undefined, { callbackUrl: "/employee" });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`focus:outline-none transition-colors duration-300 ${
                currentRole === "admin"
                  ? "text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white"
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t transition-colors duration-300 ${
                currentRole === "admin"
                  ? "border-red-200 dark:border-red-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div
                className={`pt-4 border-t ${
                  currentRole === "admin"
                    ? "border-red-200 dark:border-red-700"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <WalletConnect />
                  <ThemeSwitch />
                  <button
                    className={cn(
                      " flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
                      "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                      "border border-gray-200 dark:border-gray-600",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    )}
                    onClick={() => {
                      sounds.play();
                      router.push(
                        currentRole === "admin"
                          ? "/admin/notifications"
                          : "/news"
                      );
                    }}
                  >
                    <Bell />
                  </button>
                  {session ? (
                    <button
                      onClick={() => {
                        sounds.play();
                        signOut();
                      }}
                      className="text-red-600 hover:text-red-700 text-sm btn"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.play();
                        signIn(undefined, { callbackUrl: "/employee" });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
