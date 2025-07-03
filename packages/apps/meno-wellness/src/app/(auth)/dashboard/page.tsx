// packages/apps/meno-wellness/src/app/(auth)/dashboard/page.tsx
'use client';

import { useState } from "react";
import { useAuth } from "../../components/auth-provider";
import { db } from "@/lib/firebase"; // Import the Firestore instance

// Import shared and local components
import { Journal } from "@metiscore/ui";
import { InvitePartnerCard } from "../../components/InvitePartnerCard";
import { AnalysisReport } from "../../components/AnalysisReport";
import { DashboardCard } from "../../components/DashboardCard";

// Import types
import { SentimentAnalysisResponse } from '@metiscore/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzeRequest = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    const analysisApiUrl = process.env.NEXT_PUBLIC_SENTIMENT_API_URL;

    if (!analysisApiUrl) {
      console.error("Sentiment API URL is not configured.");
      setAnalysisError("The analysis service is not configured correctly.");
      setIsAnalyzing(false);
      return;
    }

    try {
      const response = await fetch(analysisApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, focus: "Menopause Analysis" }),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || 'API call failed');
      }

      const result: SentimentAnalysisResponse = await response.json();
      setAnalysisResult(result);

    } catch (e: any) {
      console.error("Error during analysis: ", e);
      setAnalysisError(e.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return <div className="text-center text-white p-10">Redirecting to login...</div>
  }

  return (
    <div className="p-4 md:p-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardCard title="AI Chat">
            <p className="text-center text-gray-500 p-8">The AI Chat component will go here.</p>
          </DashboardCard>
          <DashboardCard title="My Journal">
            <Journal
              user={user}
              db={db}
              onAnalyzeClick={handleAnalyzeRequest}
            />
          </DashboardCard>
          <DashboardCard title="Invite Your Partner">
            <InvitePartnerCard />
          </DashboardCard>
        </div>

        {/* Right Column (Sticky Analysis Report) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
             <DashboardCard title="Analysis Report" className="min-h-[24rem] flex flex-col justify-center">
                {isAnalyzing && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-700">Analyzing...</p>
                    <p className="text-sm text-slate-500">Please wait a moment.</p>
                  </div>
                )}
                {analysisError && !isAnalyzing && (
                   <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                    <p className="font-bold">Analysis Failed</p>
                    <p className="text-sm">{analysisError}</p>
                  </div>
                )}
                {!isAnalyzing && analysisResult && (
                  <AnalysisReport response={analysisResult} />
                )}
                {!isAnalyzing && !analysisResult && !analysisError && (
                  <div className="text-center">
                    <p className="text-slate-500">Click "Analyze" on a past journal entry to see results here.</p>
                  </div>
                )}
             </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
