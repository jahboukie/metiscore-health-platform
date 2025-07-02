'use client';

import { SentimentAnalysisResponse } from '@metiscore/types';

// A helper function to determine the color for the crisis assessment card
const getCrisisColor = (level?: string) => {
  if (!level) return 'bg-gray-100 border-gray-500 text-gray-900';
  const s = level.toLowerCase();
  if (s.includes('high') || s.includes('critical')) return 'bg-red-100 border-red-500 text-red-900';
  if (s.includes('medium') || s.includes('elevated')) return 'bg-yellow-100 border-yellow-500 text-yellow-900';
  return 'bg-green-100 border-green-500 text-green-900';
};

// This defines the "props" our component accepts
interface AnalysisReportProps {
  response: SentimentAnalysisResponse;
}

export function AnalysisReport({ response = {} }: AnalysisReportProps) {
  // Use optional chaining (?.) to safely access nested properties
  const { insights, sentiment, emotions, crisisAssessment } = response;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">AI Analysis Report</h3>

      <div className="bg-slate-50 p-4 rounded-lg shadow-sm mb-4">
        <h4 className="text-lg font-semibold text-blue-700 mb-2">Overall Assessment</h4>
        <p className="text-slate-700">{insights?.overall_assessment || 'No assessment available.'}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2 text-slate-700">Sentiment</h4>
          <p className="text-slate-600">Category: {sentiment?.category || 'N/A'}</p>
          <p className="text-slate-600">Score: {sentiment?.score?.toFixed(2) || 'N/A'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold text-lg mb-2 text-slate-700">Emotions</h4>
          <p className="text-slate-600">Primary: {emotions?.primary || 'N/A'}</p>
          <p className="text-slate-600">Intensity: {emotions?.emotional_intensity?.toFixed(2) || 'N/A'}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-sm border-l-4 ${getCrisisColor(crisisAssessment?.risk_level)} md:col-span-2`}>
          <h4 className="font-semibold text-lg mb-2">Crisis Assessment</h4>
          <p>Risk: {crisisAssessment?.risk_level || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
