"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { schoolLevelsArray } from "@/lib/constants";
import { useState } from "react";
import { YearModal } from "./components/year-modal";
import { Year, SchoolLevel } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface YearsGroupedByLevel extends Year {
  students_count: number;
}

interface LevelsPageClientProps {
  levelsData: Record<string, YearsGroupedByLevel[]>;
}

export function LevelsPageClient({ levelsData }: LevelsPageClientProps) {
  const levelIconMap = schoolLevelsArray.reduce((acc, lvl) => {
    acc[lvl.value] = { icon: lvl.icon, label: lvl.label };
    return acc;
  }, {} as Record<string, { icon: LucideIcon; label: string }>);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleCreateYear = (level: SchoolLevel) => {
    setSelectedLevel(level);
    setSelectedYear(null);
    setModalOpen(true);
  };

  const handleEditYear = (year: Year) => {
    setSelectedYear(year);
    setSelectedLevel(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedYear(null);
    setSelectedLevel(null);
  };

  const handleDeleteYear = async (year: Year) => {
    if (
      !confirm(
        `Are you sure you want to delete Year ${year.yearNumber} (${year.name})? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/years/${year.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete year");
      }

      toast.success("Year deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete year"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {schoolLevelsArray.map((lvl) => {
          const levelKey = lvl.value as unknown as string;
          const years = levelsData?.[levelKey] || [];
          const levelInfo = levelIconMap[levelKey];
          if (!levelInfo) return null;

          const Icon = levelInfo.icon;
          const totalStudents = years.reduce(
            (sum, year) => sum + year.students_count,
            0
          );

          return (
            <Card
              key={levelKey}
              className="group border-2 border-accent-foreground/50"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-xl font-semibold text-accent-foreground transition-colors">
                  {levelInfo.label}
                </CardTitle>
                <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-7 h-7 text-foreground group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      Years
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateYear(levelKey as SchoolLevel)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Year
                    </Button>
                  </div>
                  <div className="space-y-2 py-2">
                    {years.map((year) => (
                      <div
                        key={year.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors border border-accent-foreground/20"
                      >
                        <Link
                          href={`levels/${levelKey.toLowerCase()}-${
                            year.yearNumber
                          }`}
                          className="flex-1 min-w-0"
                        >
                          <div>{year.name}</div>
                        </Link>
                        <div className="flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditYear(year)}
                            disabled={isDeleting}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteYear(year)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-accent-foreground">
                    {totalStudents.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <YearModal
        open={modalOpen}
        onClose={handleCloseModal}
        initialData={selectedYear}
        levelFilter={selectedLevel || undefined}
      />
    </>
  );
}
