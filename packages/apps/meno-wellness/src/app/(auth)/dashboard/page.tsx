import { JournalForm } from "../../components/JournalForm";
import { InvitePartnerCard } from "../../components/InvitePartnerCard";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-12">
      {/* Journaling Section */}
      <div>
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
      </div>

      {/* Invite Partner Section */}
      <div>
        <InvitePartnerCard />
      </div>
    </div>
  );
}
