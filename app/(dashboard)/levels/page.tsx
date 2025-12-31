import { Header } from "@/components/header";
import { getLevelsData } from "./_actions/getLevelsData";
import { LevelsPageClient } from "./page.client";

export default async function Page() {
  const levelsData = await getLevelsData();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header title="Levels" description="Overview of all levels" />
        <LevelsPageClient levelsData={levelsData || {}} />
      </div>
    </div>
  );
}
