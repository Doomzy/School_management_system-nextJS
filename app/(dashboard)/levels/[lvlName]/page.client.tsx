"use client";
import { Header } from "@/components/header";
import { SchoolLevel } from "@prisma/client";
import { useState } from "react";
import { ClassModal } from "./components/class-modal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  classColumns,
  Student,
  studentColumns,
} from "./components/table/columns";
import { DataTable } from "@/components/data-table";

interface YearPageClientProps {
  initialData: {
    name: string;
    id: string;
    yearNumber: number;
    level: SchoolLevel;
    classes: Array<{
      id: string;
      yearId: string;
      name: string;
      section: string;
      capacity: number;
      roomNumber: string | null;
      students: Array<{
        firstName: string;
        lastName: string;
        phone: string | null;
      }>;
    }>;
  };
}

export function YearPageClient({ initialData }: YearPageClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [classStudents, setClassStudents] = useState<Student[]>();

  const router = useRouter();

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    router.refresh();
  };

  const handleCreateClass = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between">
        <Header
          title={`${initialData.level} - ${initialData.name}`}
          description={`Detailed overview and information for ${initialData?.name} in the ${initialData.level} level.`}
        />
        <Button className="gap-2" onClick={handleCreateClass}>
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="mb-2 mt-8 text-3xl font-medium">Classes</div>
      <DataTable
        columns={classColumns}
        data={initialData.classes}
        enableSorting={false}
        enableGlobalFilter={false}
        disablePagination={true}
        highlightOnClick={true}
        onRowClick={(r) => setClassStudents(r.students)}
      />

      <div className=" mt-8 text-3xl font-medium">Students</div>
      <p className="text-xs mb-2 text-muted-foreground sm:text-sm">
        Click on a class from the table above to view its students
      </p>

      <DataTable
        columns={studentColumns}
        data={classStudents ?? []}
        enableSorting={false}
        enableGlobalFilter={false}
        disablePagination={true}
      />

      <ClassModal
        initialData={null}
        onClose={handleModalClose}
        open={isCreateModalOpen}
        yearId={initialData.id}
      />
    </div>
  );
}
