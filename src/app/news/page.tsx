"use client";

import { Header } from "@/components/Header";
import { useState } from "react";
import { Bell, Calendar, Tag, Search, Bookmark, Share2 } from "lucide-react";

interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  isImportant: boolean;
  isRead: boolean;
  tags: string[];
}

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showOnlyImportant, setShowOnlyImportant] = useState(false);

  const news: News[] = [
    {
      id: "1",
      title: "New Remote Work Policy",
      content:
        "Starting next month, we will implement a new remote work policy that will allow employees to work from home up to 3 days per week. This change aims to improve work-life balance.",
      category: "Policies",
      author: "Human Resources",
      date: "2024-01-15",
      isImportant: true,
      isRead: false,
      tags: ["remote work", "policy", "benefits"],
    },
    {
      id: "2",
      title: "Quarter Results - 25% Growth",
      content:
        "We are pleased to announce that our company achieved 25% growth in the last quarter. This result is the fruit of the dedicated work of the entire team and the trust of our clients.",
      category: "Results",
      author: "Management",
      date: "2024-01-10",
      isImportant: true,
      isRead: true,
      tags: ["results", "growth", "success"],
    },
    {
      id: "3",
      title: "New Project Management System",
      content:
        "We are implementing a new project management system that will significantly improve our productivity and communication between teams. Training will be offered next week.",
      category: "Technology",
      author: "IT",
      date: "2024-01-08",
      isImportant: false,
      isRead: false,
      tags: ["system", "productivity", "training"],
    },
    {
      id: "4",
      title: "Company Event - January 2024",
      content:
        "Next Saturday, January 20th, we will hold our annual company event. The event will be held at Central Event Space, starting at 7pm. All employees are invited!",
      category: "Events",
      author: "Communication",
      date: "2024-01-05",
      isImportant: false,
      isRead: true,
      tags: ["event", "celebration", "social"],
    },
    {
      id: "5",
      title: "Health Plan Update",
      content:
        "We inform you that our health plan has been updated with new coverages and benefits. Starting in February, all employees will have access to online consultations and expanded dental coverage.",
      category: "Benefits",
      author: "Human Resources",
      date: "2024-01-03",
      isImportant: false,
      isRead: false,
      tags: ["health", "benefits", "plan"],
    },
  ];

  const categories = [
    "All",
    "Policies",
    "Results",
    "Technology",
    "Events",
    "Benefits",
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Company News
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Stay up to date with the latest news, policies and company events
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
                  placeholder="Search news..."
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
                  {filteredNews.length} news item
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
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <span>By: {item.author}</span>
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
