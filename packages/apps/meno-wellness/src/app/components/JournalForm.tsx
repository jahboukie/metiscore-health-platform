'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { Button } from '@metiscore/ui';

// Define the structure of a journal entry for type safety
interface JournalEntry {
  id: string;
  text: string;
  createdAt: { seconds: number; nanoseconds: number; } | null;
  isShared: boolean;
}

// Define the props our component will accept from the parent page
interface JournalProps {
    onAnalyzeRequest: (text: string) => void;
}

export const Journal = ({ onAnalyzeRequest }: JournalProps) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // This useEffect hook sets up a REAL-TIME listener for the journal entries.
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    // This is the complex query that will require a Firestore Index
    const q = query(
      collection(db, 'journal_entries'), 
      where('userId', '==', user.uid), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(fetchedEntries);
    }, (error) => {
        // This is where the Firestore Index error will appear
        console.error("Firestore query failed. This likely requires a new index. See the full error for a link to create it.", error);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [user]);

  // This function now ONLY saves the entry.
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryText.trim() || !user) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'journal_entries'), {
        userId: user.uid,
        text: newEntryText,
        isShared: isShared,
        createdAt: serverTimestamp(),
      });
      // Clear the form after saving
      setNewEntryText('');
      setIsShared(false);
    } catch (err) {
      console.error("Failed to save entry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSaveEntry} className="mb-6">
        <textarea 
          value={newEntryText} 
          onChange={(e) => setNewEntryText(e.target.value)} 
          placeholder="How are you feeling today?" 
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 h-32"
        />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isShared} 
              onChange={(e) => setIsShared(e.target.checked)} 
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            /> 
            <span className="ml-2 text-sm text-slate-700">Share with partner</span>
          </label>
          <Button 
            type="submit" 
            disabled={isLoading || !newEntryText.trim()}
            className="rounded-md bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>

      <h3 className="text-xl font-bold text-slate-800 mb-4 pt-4 border-t">Past Entries</h3>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {entries.length > 0 ? entries.map((entry) => (
          <div key={entry.id} className="bg-slate-100/80 p-4 rounded-lg">
            <p className="text-slate-700 whitespace-pre-wrap">{entry.text}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-slate-500">
                {entry.createdAt ? new Date(entry.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
              </p>
              <div className="flex items-center space-x-2">
                {entry.isShared && <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-1 rounded-full">Shared</span>}
                <Button 
                  onClick={() => onAnalyzeRequest(entry.text)}
                  className="bg-indigo-500 text-white text-xs py-1 px-3 rounded-lg font-bold hover:bg-indigo-600 transition"
                >
                  Analyze
                </Button>
              </div>
            </div>
          </div>
        )) : <p className="text-slate-500 text-center py-4">No past entries yet.</p>}
      </div>
    </div>
  );
};
