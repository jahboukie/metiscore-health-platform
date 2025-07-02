'use client';

import { useState } from "react";
// Import the actual, functional components
import { InvitePartnerCard } from "../../components/InvitePartnerCard";
import { Journal } from "../../components/JournalForm";
import { AnalysisReport } from "../../components/AnalysisReport";
import { SentimentAnalysisResponse } from '@metiscore/types';

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeRequest = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_SENTIMENT_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, focus: "Menopause Analysis" }),
      });

      if (!response.ok) throw new Error('API call failed');
      const result: SentimentAnalysisResponse = await response.json();
      setAnalysisResult(result);

    } catch (e) {
      console.error("Error during analysis: ", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Chat Card (Placeholder for now) */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6">
             <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Chat</h1>
             <p className="text-gray-600">The AI Chat component will go here.</p>
             {/* We will replace this with the <ChatInterface /> component next */}
          </div>

          {/* My Journal Card - Rendering the REAL component */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">My Journal</h1>
            <Journal onAnalyzeRequest={handleAnalyzeRequest} />
          </div>

          {/* Invite Partner Card - Rendering the REAL component */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <InvitePartnerCard />
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 min-h-[300px]">
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Analyzing...</p>
              </div>
            ) : analysisResult ? (
              <AnalysisReport response={analysisResult} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Analysis results will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
