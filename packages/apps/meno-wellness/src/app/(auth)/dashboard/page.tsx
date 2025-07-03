// packages/apps/meno-wellness/src/app/(auth)/dashboard/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useAuth } from "../../components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';

import { Journal, AnalysisReport, JournalEntry } from "@metiscore/ui";
import { InvitePartnerCard } from "../../components/InvitePartnerCard";
import { DashboardCard } from "../../components/DashboardCard";
import { SentimentAnalysisResponse } from '@metiscore/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // DATA FETCHING LOGIC NOW LIVES ON THE PAGE
  useEffect(() => {
    if (!user) {
      setJournalEntries([]);
      return;
    }
    const q = query(collection(db, 'journal_entries'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JournalEntry[];
      setJournalEntries(entries);
    }, (error) => {
      console.error("MenoWellness query failed:", error); // Log the specific error
    });
    return () => unsubscribe();
  }, [user]);

  // SAVE LOGIC NOW LIVES ON THE PAGE
  const handleSaveEntry = async (text: string, isShared: boolean) => {
    if (!text.trim() || !user) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'journal_entries'), {
        userId: user.uid,
        text: text,
        isShared: isShared,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeRequest = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    // ... (rest of analysis logic is the same)
    const analysisApiUrl = process.env.NEXT_PUBLIC_SENTIMENT_API_URL;
    if (!analysisApiUrl) {
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
      setAnalysisError(e.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) return <div className="text-center text-white p-10">Redirecting...</div>;

  return (
    <div className="p-4 md:p-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
        <div className="lg:col-span-2 space-y-8">
          <DashboardCard title="AI Chat"><p className="text-center text-gray-500 p-8">The AI Chat component will go here.</p></DashboardCard>
          <DashboardCard title="My Journal">
            <Journal
              entries={journalEntries}
              isSaving={isSaving}
              onSaveEntry={handleSaveEntry}
              onAnalyzeClick={handleAnalyzeRequest}
            />
          </DashboardCard>
          <DashboardCard title="Invite Your Partner"><InvitePartnerCard /></DashboardCard>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <DashboardCard title="Analysis Report" className="min-h-[24rem] flex flex-col justify-center">
              {isAnalyzing && <div className="text-center"><p className="text-lg font-semibold text-slate-700">Analyzing...</p></div>}
              {analysisError && !isAnalyzing && <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg"><p className="font-bold">Analysis Failed</p><p className="text-sm">{analysisError}</p></div>}
              {!isAnalyzing && analysisResult && <AnalysisReport response={analysisResult} />}
              {!isAnalyzing && !analysisResult && !analysisError && <div className="text-center"><p className="text-slate-500">Click "Analyze" on a past journal entry.</p></div>}
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
