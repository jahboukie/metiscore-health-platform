import { JournalForm } from "../../components/JournalForm";
import { AnalysisReport } from "../../components/AnalysisReport";

// Create some sample data to display for now
const sampleAnalysis = {
  wellbeingScore: 87,
  topEmotions: ["Anxiety", "Frustration", "Optimism"],
  keySymptoms: ["Hot Flashes", "Sleep Issues", "Brain Fog"],
  userRecommendations: [
    "Maintain regular follow-ups with healthcare provider.",
    "Continue balanced approach to symptom management.",
  ],
  partnerRecommendations: [
    "Maintain open dialogue about the menopause experience.",
    "Regularly check in about relationship needs and changes.",
  ],
};

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            My Wellness Journal
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            How are you feeling today? Capture your thoughts and symptoms below.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <JournalForm />
      </div>

      {/* We are adding the report below the form */}
      {sampleAnalysis && (
        <div className="mt-12">
          <AnalysisReport {...sampleAnalysis} />
        </div>
      )}
    </div>
  );
}
