"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Subject } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { subjectsColumns } from "./components/table/columns";

interface SubjectListClientProps {
  subjects: Subject[];
}

export function SubjectListClient({ subjects }: SubjectListClientProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Header title="Subjects" description="Manage all subjects" />
          <Link href="/subjects/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </Link>
        </div>

        <DataTable
          columns={subjectsColumns}
          data={subjects}
          enableSorting={false}
          enableGlobalFilter={false}
        />
      </div>
    </div>
  );
}
