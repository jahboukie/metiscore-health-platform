'use client';

import { useState } from 'react';
import { Button } from '@metiscore/ui';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./auth-provider";
import { AnalysisReport } from './AnalysisReport';
import { SentimentAnalysisResponse } from '@metiscore/types'; // Import our new type

export function JournalForm() {
  const { user } = useAuth();
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!entry.trim() || !user) return;

    setIsLoading(true);
    setAnalysisResult(null);

    const newEntryData = {
      userId: user.uid,
      text: entry,
      createdAt: serverTimestamp(),
      isShared: false,
      analysis: {},
      appOrigin: "MenoWellness",
    };

    try {
      await addDoc(collection(db, "journal_entries"), newEntryData);

      const response = await fetch(process.env.NEXT_PUBLIC_SENTIMENT_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: entry, focus: "Menopause Analysis" }), // Added focus for context
      });

      if (!response.ok) throw new Error('API call failed');

      const result: SentimentAnalysisResponse = await response.json();
      setAnalysisResult(result);

      setEntry('');
    } catch (e) {
      console.error("Error during submit process: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="w-full">
          <label htmlFor="journal-entry" className="sr-only">Your journal entry</label>
          <textarea
            rows={8}
            name="journal-entry"
            id="journal-entry"
            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="How are you feeling today? Capture your thoughts and symptoms below..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400"
            disabled={isLoading || !entry.trim()}
          >
            {isLoading ? "Analyzing..." : "Save & Analyze"}
          </Button>
        </div>
      </form>

      {/* This now passes the entire response object to our updated component */}
      {!isLoading && analysisResult && (
        <div className="mt-12">
          <AnalysisReport response={analysisResult} />
        </div>
      )}
    </>
  );
}
