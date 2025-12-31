import { SchoolLevel } from "@prisma/client";
import { getYearClasses } from "./_actions/getYearClasses";
import { YearPageClient } from "./page.client";

export default async function Page(props: {
  params: Promise<{ lvlName: string }>;
}) {
  const { lvlName } = await props.params;
  const yearNumber = lvlName.split("-")[1];
  const levelName = lvlName.split("-")[0];

  const yearInfo = await getYearClasses({
    yearId: Number(yearNumber),
    level: levelName.toUpperCase() as SchoolLevel,
  });

  if (!yearInfo) {
    return <div>Year not found</div>;
  }

  return <YearPageClient initialData={yearInfo} />;
}
