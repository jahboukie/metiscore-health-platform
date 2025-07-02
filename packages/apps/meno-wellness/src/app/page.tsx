'use client'; // This page is interactive, so it's a client component

import { useState } from 'react';
import { useAuth } from './components/auth-provider';
import { Navigate } from 'react-router-dom'; // We'll handle redirection differently in Next.js
import { DashboardCard } from './components/DashboardCard';
import { AnalysisReport } from './components/AnalysisReport'; // We'll reuse this

// Placeholder components for now
const JournalPlaceholder = () => <div className="text-center text-gray-500 p-8">The Journal component will go here.</div>;
const ChatPlaceholder = () => <div className="text-center text-gray-500 p-8">The AI Chat component will go here.</div>;
const InvitePlaceholder = () => <div className="text-center text-gray-500 p-8">The Invite Partner component will go here.</div>;


export default function HomePage() {
  const { user, loading } = useAuth();
  const [apiResponse, setApiResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (loading) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  // In Next.js, we handle redirects differently, often with middleware.
  // For now, we'll just show a login prompt if not logged in.
  if (!user) {
    return (
        <div className="text-center p-10">
            <h1 className="text-4xl text-white font-bold">Welcome to Metiscore Health</h1>
            <p className="text-white/80 mt-4">Please sign in to access your dashboard.</p>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <DashboardCard title="AI Chat">
            <ChatPlaceholder />
          </DashboardCard>
          <DashboardCard title="My Journal">
            <JournalPlaceholder />
          </DashboardCard>
          <DashboardCard title="Invite Your Partner">
            <InvitePlaceholder />
          </DashboardCard>
        </div>

        <div className="sticky top-24">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl min-h-[20rem] flex flex-col justify-center">
            {isAnalyzing && (
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700">Analyzing...</p>
              </div>
            )}
            {apiResponse ? (
              <AnalysisReport response={apiResponse} />
            ) : (
              !isAnalyzing && (
                <div className="text-center">
                  <p className="text-slate-500">Analysis results will appear here.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
