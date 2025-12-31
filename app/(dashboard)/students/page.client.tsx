"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { SchoolLevel, Student } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { studentsColumns } from "./components/table/columns";

interface StudentListClientProps {
  students: (Student & {
    class: {
      name: string;
      year: { yearNumber: number; level: SchoolLevel };
    };
  })[];
}

export function StudentListClient({ students }: StudentListClientProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Header title="Students" description="Manage all students" />
          <Link href="/students/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>

        <DataTable
          columns={studentsColumns}
          data={students}
          enableSorting={false}
          enableGlobalFilter={false}
        />
      </div>
    </div>
  );
}
