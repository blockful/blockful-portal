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
} from "lucide-react";
import { ThemeSwitch } from "./ThemeSwitch";
import { signIn, signOut, useSession } from "next-auth/react";
import { Howl } from "howler";
import Image from "next/image";
import { cn } from "@/app/shared/lib/cn";
import { useRouter } from "next/navigation";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
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

  const navItems = [
    { href: "/", label: "Home", icon: User },
    { href: "/reimbursement", label: "Reimbursement", icon: Receipt },
    { href: "/ooo", label: "OOO", icon: MessageSquare },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/organizations", label: "Organization", icon: Users },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300"
            >
              GateFul
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Role
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
                  signIn();
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
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900 dark:focus:text-white transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <ThemeSwitch />
                  <button
                    className={cn(
                      " flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
                      "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                      "border border-gray-200 dark:border-gray-600",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    )}
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
                        signIn();
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
