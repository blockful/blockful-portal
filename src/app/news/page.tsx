"use client";

import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Tag,
  Search,
  Bookmark,
  Share2,
  AlertTriangle,
  Users,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { useGitHubMembers, GitHubMember } from "@/hooks/useGitHubMembers";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: "OOO" | "Reimbursements" | "Team News" | "Alerts";
  author: string;
  authorAvatar?: string;
  date: string;
  isImportant: boolean;
  isRead: boolean;
  tags: string[];
  status?: "pending" | "approved" | "rejected" | "active" | "completed";
  priority?: "low" | "medium" | "high" | "critical";
}

export default function GateFulNewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showOnlyImportant, setShowOnlyImportant] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);

  // Buscar membros do GitHub
  const { members } = useGitHubMembers({ org: "blockful" });

  useEffect(() => {
    if (members.length > 0) {
      // Criar notícias com dados reais dos membros
      const createNewsWithRealMembers = (): NewsItem[] => {
        const teamMembers = members.slice(0, 5); // Usar os primeiros 5 membros

        return [
          // OOO Section - usando membros reais
          {
            id: "ooo-1",
            title: `${
              teamMembers[0]?.name || teamMembers[0]?.login || "João Silva"
            } - Out of Office`,
            content: `${
              teamMembers[0]?.name || teamMembers[0]?.login || "João Silva"
            } will be out of office from January 20th to January 25th for vacation. During this period, please contact ${
              teamMembers[1]?.name || teamMembers[1]?.login || "Maria Santos"
            } for urgent matters.`,
            category: "OOO",
            author:
              teamMembers[0]?.name || teamMembers[0]?.login || "João Silva",
            authorAvatar: teamMembers[0]?.avatar_url,
            date: "2024-01-18",
            isImportant: true,
            isRead: false,
            tags: ["vacation", "ooo", "team"],
            status: "active",
          },
          {
            id: "ooo-2",
            title: `${
              teamMembers[1]?.name || teamMembers[1]?.login || "Ana Costa"
            } - Sick Leave`,
            content: `${
              teamMembers[1]?.name || teamMembers[1]?.login || "Ana Costa"
            } is on sick leave today. Her tasks have been temporarily reassigned to the development team.`,
            category: "OOO",
            author:
              teamMembers[1]?.name || teamMembers[1]?.login || "Ana Costa",
            authorAvatar: teamMembers[1]?.avatar_url,
            date: "2024-01-19",
            isImportant: false,
            isRead: true,
            tags: ["sick leave", "ooo", "reassignment"],
            status: "active",
          },
          {
            id: "ooo-3",
            title: `${
              teamMembers[2]?.name || teamMembers[2]?.login || "Carlos Mendes"
            } - Business Trip`,
            content: `${
              teamMembers[2]?.name || teamMembers[2]?.login || "Carlos Mendes"
            } will be traveling for business meetings from January 22nd to January 24th. Available for urgent calls only.`,
            category: "OOO",
            author:
              teamMembers[2]?.name || teamMembers[2]?.login || "Carlos Mendes",
            authorAvatar: teamMembers[2]?.avatar_url,
            date: "2024-01-17",
            isImportant: false,
            isRead: false,
            tags: ["business trip", "ooo", "meetings"],
            status: "active",
          },

          // Reimbursements Section - usando membros reais
          {
            id: "reimb-1",
            title: "Conference Expenses Approved",
            content: `Your reimbursement request for the React Conference expenses ($450) has been approved and will be processed in the next payroll.`,
            category: "Reimbursements",
            author:
              teamMembers[3]?.name || teamMembers[3]?.login || "Finance Team",
            authorAvatar: teamMembers[3]?.avatar_url,
            date: "2024-01-19",
            isImportant: false,
            isRead: false,
            tags: ["conference", "expenses", "approved"],
            status: "approved",
          },
          {
            id: "reimb-2",
            title: "Equipment Purchase Pending",
            content: `Your request for a new Mac is under review. Expected approval within 2 business days.`,
            category: "Reimbursements",
            author:
              teamMembers[4]?.name || teamMembers[4]?.login || "IT Department",
            authorAvatar: teamMembers[4]?.avatar_url,
            date: "2024-01-18",
            isImportant: false,
            isRead: true,
            tags: ["equipment", "MAC", "pending"],
            status: "pending",
          },
          {
            id: "reimb-3",
            title: "Travel Expenses Rejected",
            content: `Your travel expense claim for $150 has been rejected due to missing receipts. Please resubmit with proper documentation.`,
            category: "Reimbursements",
            author:
              teamMembers[0]?.name || teamMembers[0]?.login || "Finance Team",
            authorAvatar: teamMembers[0]?.avatar_url,
            date: "2024-01-16",
            isImportant: true,
            isRead: false,
            tags: ["travel", "expenses", "rejected"],
            status: "rejected",
          },

          // Team News Section - mantendo nomes genéricos
          {
            id: "news-1",
            title: "New Team Member - Welcome Fran!",
            content:
              "Please welcome Fran to our development team! Fran joins us as a Community Manager and will be working on the new customer portal project.",
            category: "Team News",
            author: "HR Department",
            date: "2024-01-19",
            isImportant: true,
            isRead: false,
            tags: ["new hire", "team", "welcome"],
          },
          {
            id: "news-2",
            title: "Q4 Results - 30% Growth Achieved!",
            content:
              "Congratulations to the entire team! We achieved 30% growth in Q4, exceeding our targets. This success is thanks to everyone's hard work and dedication.",
            category: "Team News",
            author: "Management",
            date: "2024-01-15",
            isImportant: true,
            isRead: true,
            tags: ["results", "growth", "success"],
          },
          {
            id: "news-3",
            title: "New Project Management Tool",
            content:
              "We're implementing ClickUp as our new project management tool. Training sessions will be held next week. This will improve our workflow and collaboration.",
            category: "Team News",
            author: "IT Department",
            date: "2024-01-14",
            isImportant: false,
            isRead: false,
            tags: ["tool", "clickup", "training"],
          },

          // Alerts Section - usando membros reais
          {
            id: "alert-1",
            title: "Critical: System Maintenance Tonight",
            content:
              "Scheduled maintenance tonight from 2:00 AM to 4:00 AM. All systems will be temporarily unavailable. Please save your work before the maintenance window.",
            category: "Alerts",
            author:
              teamMembers[1]?.name || teamMembers[1]?.login || "IT Department",
            authorAvatar: teamMembers[1]?.avatar_url,
            date: "2024-01-19",
            isImportant: true,
            isRead: false,
            tags: ["maintenance", "critical", "system"],
            priority: "critical",
          },
          {
            id: "alert-2",
            title: "Security Alert: Password Update Required",
            content:
              "Due to recent security updates, all employees must update their passwords by the end of this week. Use the password reset tool in the portal.",
            category: "Alerts",
            author:
              teamMembers[2]?.name || teamMembers[2]?.login || "Security Team",
            authorAvatar: teamMembers[2]?.avatar_url,
            date: "2024-01-18",
            isImportant: true,
            isRead: false,
            tags: ["security", "password", "update"],
            priority: "high",
          },
          {
            id: "alert-3",
            title: "Office Closure - Holiday",
            content:
              "The office will be closed on Monday, January 22nd, for the holiday. All employees are encouraged to work remotely if needed.",
            category: "Alerts",
            author:
              teamMembers[3]?.name || teamMembers[3]?.login || "HR Department",
            authorAvatar: teamMembers[3]?.avatar_url,
            date: "2024-01-17",
            isImportant: false,
            isRead: true,
            tags: ["holiday", "office", "closure"],
            priority: "medium",
          },
        ];
      };

      setNews(createNewsWithRealMembers());
    }
  }, [members]);

  const categories = ["All", "OOO", "Reimbursements", "Team News", "Alerts"];

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesImportant = !showOnlyImportant || item.isImportant;

    return matchesSearch && matchesCategory && matchesImportant;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "OOO":
        return <Users className="h-4 w-4" />;
      case "Reimbursements":
        return <Receipt className="h-4 w-4" />;
      case "Team News":
        return <TrendingUp className="h-4 w-4" />;
      case "Alerts":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "active":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              GateFul News
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Stay updated with OOO status, reimbursements, team news, and
            important alerts
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 mb-6 transition-all duration-300">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search GateFul News..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Important Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="important"
                  checked={showOnlyImportant}
                  onChange={(e) => setShowOnlyImportant(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 transition-colors duration-300"
                />
                <label
                  htmlFor="important"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300"
                >
                  Important only
                </label>
              </div>

              {/* Counter */}
              <div className="flex items-center justify-end">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  {filteredNews.length} item
                  {filteredNews.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 transition-all duration-300 ${
                !item.isRead
                  ? "border-l-4 border-blue-500 dark:border-blue-400"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                      {item.title}
                    </h2>
                    {item.isImportant && (
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full transition-colors duration-300">
                        Important
                      </span>
                    )}
                    {!item.isRead && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full transition-colors duration-300">
                        New
                      </span>
                    )}
                    {item.priority && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority.charAt(0).toUpperCase() +
                          item.priority.slice(1)}
                      </span>
                    )}
                    {item.status && getStatusIcon(item.status)}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.authorAvatar && (
                        <img
                          src={item.authorAvatar}
                          alt={item.author}
                          className="w-4 h-4 rounded-full"
                        />
                      )}
                      <span>By: {item.author}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors duration-300">
                    {item.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded transition-colors duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300">
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
              No news found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Try adjusting the search filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
