// packages/shared/ui/src/Journal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import { Button } from './Button';
import { SentimentAnalysisResponse } from '@metiscore/types';

// --- Props Interface ---
// user: The authenticated Firebase user object.
// db: The Firestore database instance.
// onAnalyzeClick: A function passed from the parent page to trigger analysis.
interface JournalProps {
  user: { uid: string } | null; // Pass only the necessary user info
  db: any; // Pass the Firestore instance as a prop
  onAnalyzeClick: (text: string) => void;
}

// --- Component State and Data Structure ---
interface JournalEntry {
  id: string;
  text: string;
  createdAt: Timestamp | null;
  isShared: boolean;
}

export const Journal = ({ user, db, onAnalyzeClick }: JournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Real-time Firestore Listener ---
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const entriesCollection = collection(db, 'journal_entries');
    const q = query(
      entriesCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // onSnapshot returns an unsubscribe function
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(fetchedEntries);
      setError(null); // Clear previous errors on successful fetch
    }, (err) => {
      console.error("Firestore query failed:", err);
      setError("Failed to load journal entries. This may require a Firestore index. Check the browser console for a link to create it.");
    });

    // Cleanup: Unsubscribe from the listener when the component unmounts or user changes
    return () => unsubscribe();
  }, [user, db]);


  // --- Save Entry Logic ---
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryText.trim() || !user) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'journal_entries'), {
        userId: user.uid,
        text: newEntryText,
        isShared: isShared,
        createdAt: serverTimestamp(),
      });
      // Clear the form after a successful save
      setNewEntryText('');
      setIsShared(false);
    } catch (err) {
      console.error("Failed to save entry:", err);
      setError("Sorry, we couldn't save your entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Component Render ---
  return (
    <div>
      {/* New Entry Form */}
      <form onSubmit={handleSaveEntry} className="mb-6">
        <textarea
          value={newEntryText}
          onChange={(e) => setNewEntryText(e.target.value)}
          placeholder="How are you feeling today?"
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 h-32"
          disabled={isSaving}
        />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              disabled={isSaving}
            />
            <span className="ml-2 text-sm text-slate-700">Share with partner</span>
          </label>
          <Button
            type="submit"
            disabled={isSaving || !newEntryText.trim()}
            className="rounded-md bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>

      {/* Past Entries List */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 pt-4 border-t">Past Entries</h3>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {entries.length > 0 ? entries.map((entry) => (
          <div key={entry.id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-slate-800 whitespace-pre-wrap">{entry.text}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-slate-500">
                {entry.createdAt ? new Date(entry.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
              </p>
              <div className="flex items-center space-x-2">
                {entry.isShared && <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-1 rounded-full">Shared</span>}
                <Button
                  onClick={() => onAnalyzeClick(entry.text)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-black shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  Analyze
                </Button>
              </div>
            </div>
          </div>
        )) : (
          !error && <p className="text-slate-500 text-center py-4">No past entries yet. Write one above to get started!</p>
        )}
      </div>
    </div>
  );
};
