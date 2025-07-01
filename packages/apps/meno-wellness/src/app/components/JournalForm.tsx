'use client';

import { useState } from 'react';
import { Button } from '@metiscore/ui';

export function JournalForm() {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!entry.trim()) return; // Don't submit empty entries

    setIsLoading(true);
    console.log("Submitting entry:", entry);
    // In the next steps, we will add the logic to save this to Firestore
    // and call the sentiment analysis API.
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full">
        <label htmlFor="journal-entry" className="sr-only">
          Your journal entry
        </label>
        <textarea
          rows={8}
          name="journal-entry"
          id="journal-entry"
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Start writing..."
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
  );
}
