"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Book } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { booksColumns } from "./components/table/columns";

interface BooksListClientProps {
  books: Book[];
}

export function BooksListClient({ books }: BooksListClientProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Header
            title="Books"
            description="Manage your school's book inventory and distribution"
          />
          <Link href="/books/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </Link>
        </div>

        <DataTable
          columns={booksColumns}
          data={books}
          enableSorting={false}
          enableGlobalFilter={false}
        />
      </div>
    </div>
  );
}
