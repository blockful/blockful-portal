"use client";

import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Clock, List, Calendar, User, MessageSquare, AlertCircle, CheckCircle, Search, Filter, Grid, Table } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { oooApi } from "@/app/shared/server/ooo";

interface OOOItem {
  id: string;
  userName: string;
  userEmail: string;
  active: boolean;
  startDate: string;
  endDate: string;
  reason: string;
  message: string;
  emergencyContact: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOOOPage() {
  const [oooStatuses, setOOOStatuses] = useState<OOOItem[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<OOOItem[]>([]);
  const [isLoadingOOO, setIsLoadingOOO] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedView, setSelectedView] = useState<'cards' | 'table'>('cards');
  const [backendError, setBackendError] = useState<string | null>(null);
  const router = useRouter();

  // Load OOO statuses when component mounts
  useEffect(() => {
      loadOOOStatuses();
  }, []);

  const loadOOOStatuses = async () => {
    setIsLoadingOOO(true);
    try {
      const response = await oooApi.getAllOOOStatuses();
      const statuses = Array.isArray(response.oooStatuses) ? response.oooStatuses : [];
      setOOOStatuses(statuses);
      setFilteredStatuses(statuses);
    } catch (error: any) {
      console.error('Error loading OOO statuses:', error);
      setOOOStatuses([]);
      setFilteredStatuses([]);
      if (error.message && error.message.includes('fetch')) {
        setBackendError('Backend service is not available. Please check if the server is running.');
      } else {
        setMessage({ 
          type: 'error', 
          text: error.message || 'Failed to load OOO statuses' 
        });
      }
    } finally {
      setIsLoadingOOO(false);
    }
  };

  // Filter and search effect
  useEffect(() => {
    // Ensure oooStatuses is always an array
    let filtered = Array.isArray(oooStatuses) ? oooStatuses : [];

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(ooo => ooo && ooo.active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(ooo => ooo && !ooo.active);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ooo => 
        ooo &&
        (ooo.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         ooo.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         ooo.reason?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStatuses(filtered);
  }, [oooStatuses, statusFilter, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (active: boolean) => {
    return active 
      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  const getStatusText = (active: boolean) => {
    return active ? 'Out of Office' : 'Available';
  };

  const activeOOOStatuses = Array.isArray(oooStatuses) ? oooStatuses.filter(ooo => ooo && ooo.active) : [];
  const inactiveOOOStatuses = Array.isArray(oooStatuses) ? oooStatuses.filter(ooo => ooo && !ooo.active) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">OOO Status Management</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage all employee out-of-office statuses.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300' 
              : 'bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? 
                  <CheckCircle className="h-5 w-5" /> : 
                  <AlertCircle className="h-5 w-5" />
                }
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Backend Error Notice */}
        {backendError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Backend Service Unavailable
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>{backendError}</p>
                  <p className="mt-1">The OOO management features require the backend service to be running on localhost:4000.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Currently OOO</option>
                  <option value="inactive">Available</option>
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setSelectedView('cards')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedView === 'cards'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedView('table')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  selectedView === 'table'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Currently OOO</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeOOOStatuses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Available</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inactiveOOOStatuses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Employees</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{oooStatuses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Search className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Filtered Results</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filteredStatuses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* OOO Listings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <List className="h-5 w-5 mr-2" />
              OOO Status Overview ({filteredStatuses.length} {statusFilter === 'all' ? 'total' : statusFilter})
            </h2>
          </div>
          
          <div className="p-6">
            {isLoadingOOO ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredStatuses.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  {searchTerm || statusFilter !== 'all' 
                    ? `No OOO records found matching your criteria.`
                    : 'No OOO records found.'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : selectedView === 'cards' ? (
              <div className="grid gap-4">
                {filteredStatuses.map((ooo) => (
                  <div key={ooo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {ooo.userName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ooo.active)}`}>
                            {getStatusText(ooo.active)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{ooo.userEmail}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">Period:</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {formatDate(ooo.startDate)} - {formatDate(ooo.endDate)}
                            </p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">Reason:</p>
                            <p className="text-gray-600 dark:text-gray-400">{ooo.reason}</p>
                          </div>
                          
                          <div className="md:col-span-2">
                            <p className="font-medium text-gray-700 dark:text-gray-300">Message:</p>
                            <p className="text-gray-600 dark:text-gray-400">{ooo.message}</p>
                          </div>
                          
                          {ooo.emergencyContact && (
                            <div className="md:col-span-2">
                              <p className="font-medium text-gray-700 dark:text-gray-300">Emergency Contact:</p>
                              <p className="text-gray-600 dark:text-gray-400">{ooo.emergencyContact}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStatuses.map((ooo) => (
                      <tr key={ooo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {ooo.userName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {ooo.userEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ooo.active)}`}>
                            {getStatusText(ooo.active)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {ooo.active ? (
                            <>
                              {formatDate(ooo.startDate)} - {formatDate(ooo.endDate)}
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {ooo.active ? ooo.reason : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(ooo.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Admin OOO Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Navigation
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <a
                href="/admin/ooo"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <List className="h-4 w-4 mr-2" />
                Manage All OOO
              </a>
              <a
                href="/admin/reimbursement"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Manage Reimbursements
              </a>
              <button
                onClick={loadOOOStatuses}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}