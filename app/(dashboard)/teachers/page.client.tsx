"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Teacher } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { teachersColumns } from "./components/table/columns";

interface TeacherListClientProps {
  teachers: (Teacher & {
    subject: {
      name: string;
    } | null;
  })[];
}

export function TeacherListClient({ teachers }: TeacherListClientProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Header title="Teachers" description="Manage all teachers" />
          <Link href="/teachers/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </Link>
        </div>

        <DataTable
          columns={teachersColumns}
          data={teachers}
          enableSorting={false}
          enableGlobalFilter={false}
        />
      </div>
    </div>
  );
}
