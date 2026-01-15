"use server";

import { AlertTriangle } from "lucide-react";
import { getDistributionProblems } from "../../_actions/getDistributionProblems";
import { getProgressColor } from "@/lib/utils";

async function MissingBooksTab() {
  const { problemSummary, shortageAlerts } = await getDistributionProblems();

  return (
    <div className="space-y-8">
      {/* === Problem Overview Cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            Students with Missing Books
          </p>
          <p className="text-3xl font-bold text-red-700 mt-1">
            {problemSummary.totalMissingStudents}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            Total Books Still Needed
          </p>
          <p className="text-3xl font-bold text-amber-700 mt-1">
            {problemSummary.totalMissingBooks}
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            Books in Critical Shortage
          </p>
          <p className="text-3xl font-bold text-purple-700 mt-1">
            {problemSummary.criticalShortageBooks}
          </p>
        </div>
      </div>

      {/* === Urgent Stock Shortage Alerts === */}
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle size={20} />
          Critical Stock Shortages
        </h3>

        <div className="space-y-4">
          {shortageAlerts.map((alert, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${getProgressColor(
                alert.urgency,
                "card"
              )}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{alert.bookTitle}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Remaining:{" "}
                    <span className="font-bold">{alert.available}</span> •
                    Pending students:{" "}
                    <span className="font-bold">{alert.pendingStudents}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${getProgressColor(
                      alert.urgency,
                      "card"
                    )}`}
                  >
                    Short by ~{alert.projectedShortage}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">estimated</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MissingBooksTab;
