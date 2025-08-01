"use client";

import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  isAllDay: boolean;
  color: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">("month");

  // Mock event data
  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Team Meeting",
      description: "Weekly meeting for project alignment",
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 11, 0),
      location: "Meeting Room A",
      attendees: ["John Silva", "Mary Santos", "Peter Costa"],
      isAllDay: false,
      color: "blue",
    },
    {
      id: "2",
      title: "Project Presentation",
      description: "Presentation of the new project to the client",
      start: new Date(2024, 0, 16, 14, 0),
      end: new Date(2024, 0, 16, 15, 30),
      location: "Main Auditorium",
      attendees: ["Ana Oliveira", "Carlos Lima"],
      isAllDay: false,
      color: "green",
    },
    {
      id: "3",
      title: "Safety Training",
      description: "Mandatory training on workplace safety",
      start: new Date(2024, 0, 17, 9, 0),
      end: new Date(2024, 0, 17, 12, 0),
      location: "Training Room",
      attendees: ["All employees"],
      isAllDay: false,
      color: "red",
    },
    {
      id: "4",
      title: "Collective Vacation",
      description: "Company collective vacation period",
      start: new Date(2024, 0, 20),
      end: new Date(2024, 0, 20),
      isAllDay: true,
      color: "purple",
    },
  ];

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add days from previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 mb-6 transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Calendar
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Today Button */}
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-300"
                >
                  Today
                </button>

                {/* New Event Button */}
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center space-x-2 transition-colors duration-300">
                  <Plus className="h-4 w-4" />
                  <span>New Event</span>
                </button>
              </div>
            </div>
          </div>

          {/* Views */}
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {[
                { key: "month", label: "Month" },
                { key: "week", label: "Week" },
                { key: "day", label: "Day" },
              ].map((v) => (
                <button
                  key={v.key}
                  onClick={() => setView(v.key as any)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-300 ${
                    view === v.key
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 transition-all duration-300">
          {/* Week day header */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-center transition-colors duration-300"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.date);
              const isToday =
                day.date.toDateString() === new Date().toDateString();
              const isSelected =
                selectedDate?.toDateString() === day.date.toDateString();

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`min-h-[120px] bg-white dark:bg-gray-800 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ${
                    isToday ? "bg-blue-50 dark:bg-blue-900/30" : ""
                  } ${
                    isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        day.isCurrentMonth
                          ? isToday
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {dayEvents.length} event
                        {dayEvents.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Day events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate transition-colors duration-300 ${
                          event.color === "blue"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : event.color === "green"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : event.color === "red"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                        }`}
                        title={event.title}
                      >
                        {event.isAllDay
                          ? event.title
                          : `${formatTime(event.start)} ${event.title}`}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel with selected day events */}
        {selectedDate && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 transition-all duration-300">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Events for {formatDate(selectedDate)}
              </h3>
            </div>
            <div className="p-6">
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1 transition-colors duration-300">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                            {event.description}
                          </p>

                          <div className="space-y-1">
                            {!event.isAllDay && (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                <Clock className="h-4 w-4 mr-2" />
                                {formatTime(event.start)} -{" "}
                                {formatTime(event.end)}
                              </div>
                            )}

                            {event.location && (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                <MapPin className="h-4 w-4 mr-2" />
                                {event.location}
                              </div>
                            )}

                            {event.attendees && (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                <Users className="h-4 w-4 mr-2" />
                                {event.attendees.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          className={`w-3 h-3 rounded-full ml-4 transition-colors duration-300 ${
                            event.color === "blue"
                              ? "bg-blue-500"
                              : event.color === "green"
                              ? "bg-green-500"
                              : event.color === "red"
                              ? "bg-red-500"
                              : "bg-purple-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                    No events
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    No events scheduled for this day
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
