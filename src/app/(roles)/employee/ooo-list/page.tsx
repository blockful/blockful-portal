"use client";

import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Clock, Calendar, MessageSquare, User, AlertCircle, CheckCircle, Eye, List } from "lucide-react";
import { useSession } from "next-auth/react";
import { oooApi } from "@/app/shared/server/ooo";
import toast from "react-hot-toast";

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

export default function EmployeeOOOListPage() {
  const { data: session } = useSession();
  const [myOOOHistory, setMyOOOHistory] = useState<OOOItem[]>([]);
  const [allOOOStatuses, setAllOOOStatuses] = useState<OOOItem[]>([]);
  const [teamOOOStatuses, setTeamOOOStatuses] = useState<OOOItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'all' | 'team' | 'my'>('all');
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    loadOOOData();
  }, [session?.user?.email]);

  const loadOOOData = async () => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    try {
      // Load all OOO statuses first
      try {
        const allOOOResponse = await oooApi.getAllOOOStatuses();
        const allStatuses = Array.isArray(allOOOResponse.oooStatuses) ? allOOOResponse.oooStatuses : [];
        setAllOOOStatuses(allStatuses);
        
        // Filter my OOO history
        const myHistory = allStatuses.filter(
          (ooo: OOOItem) => ooo && ooo.userEmail === session.user.email
        );
        setMyOOOHistory(myHistory);
        
        // Filter team active OOO (excluding my records)
        const activeTeamOOO = allStatuses.filter(
          (ooo: OOOItem) => ooo && ooo.active && ooo.userEmail !== session.user.email
        );
        setTeamOOOStatuses(activeTeamOOO);
        
      } catch (oooError) {
        console.warn('Could not load OOO statuses:', oooError);
        setAllOOOStatuses([]);
        setMyOOOHistory([]);
        setTeamOOOStatuses([]);
        if (oooError instanceof Error && oooError.message.includes('fetch')) {
          setBackendError('Backend service is not available. OOO features are limited.');
        }
      }
    } catch (error) {
      console.error('Error loading OOO data:', error);
      if (error instanceof Error && error.message.includes('fetch')) {
        setBackendError('Backend service is not available. Please check if the server is running.');
      } else {
        toast.error('Failed to load OOO information');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const isDateInRange = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading OOO information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">OOO Overview</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View your OOO status and see who's currently out of office.
          </p>
        </div>

        {/* Backend Error Notice */}
        {backendError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Service Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>{backendError}</p>
                  <p className="mt-1">You can still manage your OOO status using the form.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setSelectedView('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="h-4 w-4 inline mr-2" />
            All OOOs ({allOOOStatuses.length})
          </button>
          <button
            onClick={() => setSelectedView('team')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'team'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Team Active ({teamOOOStatuses.length})
          </button>
          <button
            onClick={() => setSelectedView('my')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'my'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            My History ({myOOOHistory.length})
          </button>
        </div>

        {/* All OOO Status */}
        {selectedView === 'all' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <List className="h-5 w-5 mr-2 text-blue-500" />
                All OOO Records ({allOOOStatuses.length})
              </h2>
            </div>
            
            <div className="p-6">
              {allOOOStatuses.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No OOO records found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allOOOStatuses
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((ooo) => (
                    <div key={ooo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {ooo.userName}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({ooo.userEmail})
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ooo.active)}`}>
                            {getStatusText(ooo.active)}
                          </span>
                          {ooo.active && isDateInRange(ooo.startDate, ooo.endDate) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                              Currently Away
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {ooo.id} • Updated: {formatDateTime(ooo.updatedAt)}
                        </p>
                      </div>
                      
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
                        
                        <div className="md:col-span-2">
                          <p className="font-medium text-gray-700 dark:text-gray-300">Created:</p>
                          <p className="text-gray-600 dark:text-gray-400">{formatDateTime(ooo.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team OOO Status */}
        {selectedView === 'team' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                Team Members Currently OOO ({teamOOOStatuses.length})
              </h2>
            </div>
            
            <div className="p-6">
              {teamOOOStatuses.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">All team members are currently available!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {teamOOOStatuses.map((ooo) => (
                    <div key={ooo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {ooo.userName}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ooo.active)}`}>
                              {getStatusText(ooo.active)}
                            </span>
                            {isDateInRange(ooo.startDate, ooo.endDate) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                                Currently Away
                              </span>
                            )}
                          </div>
                          
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
              )}
            </div>
          </div>
        )}

        {/* My OOO History */}
        {selectedView === 'my' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-500" />
                My OOO History
              </h2>
            </div>
            
            <div className="p-6">
              {myOOOHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No OOO history found.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Your OOO requests will appear here once you create them.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOOOHistory
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((ooo) => (
                    <div key={ooo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ooo.active)}`}>
                            {getStatusText(ooo.active)}
                          </span>
                          {ooo.active && isDateInRange(ooo.startDate, ooo.endDate) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                              Currently Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {ooo.id} • Updated: {formatDateTime(ooo.updatedAt)}
                        </p>
                      </div>
                      
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
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* OOO Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">OOO Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <a
              href="/employee/ooo"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Clock className="h-4 w-4 mr-2" />
              Configure OOO
            </a>
            <a
              href="/employee/ooo-list"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <List className="h-4 w-4 mr-2" />
              View All OOOs
            </a>
            <button
              onClick={loadOOOData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}