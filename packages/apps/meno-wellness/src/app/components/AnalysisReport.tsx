'use client';

// We can define the shape of the Tier 1 data we expect
interface AnalysisReportProps {
  wellbeingScore: number;
  topEmotions: string[];
  keySymptoms: string[];
  userRecommendations: string[];
  partnerRecommendations: string[];
}

export function AnalysisReport({
  wellbeingScore,
  topEmotions,
  keySymptoms,
  userRecommendations,
  partnerRecommendations,
}: AnalysisReportProps) {
  return (
    <div className="mt-8 rounded-lg bg-white shadow p-6">
      <h2 className="text-xl font-semibold leading-6 text-gray-900">
        Your Wellness Analysis
      </h2>

      <div className="mt-6 border-t border-gray-200 pt-6">
        {/* We will build out the UI for each of these sections next */}
        <p><strong>Wellbeing Score:</strong> {wellbeingScore}%</p>
        <p className="mt-4"><strong>Top Emotions:</strong> {topEmotions.join(', ')}</p>
        <p className="mt-4"><strong>Key Symptoms:</strong> {keySymptoms.join(', ')}</p>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-800">💡 For You:</h3>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            {userRecommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-800">💕 For Your Partner:</h3>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            {partnerRecommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
