"use client";

import { Edit, MoreHorizontal, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book } from "./columns";
import { AlertModal } from "@/components/alert-modal";

interface CellActionProps {
  data: Book;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/classes/${data.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to delete class (Status: ${response.status})`
        );
      }

      router.refresh();
      toast.success("Class deleted successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Error deleting class:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
        title={
          "Are you sure you want to delete this book? " + `[${data.title}]`
        }
        description="This action cannot be undone."
        action="Delete"
        actionVariant="destructive"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="group"
            onClick={() => router.push(`/books/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4 transition group-hover:text-yellow-500" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="group" onClick={() => setIsOpen(true)}>
            <Trash className="mr-2 h-4 w-4 transition group-hover:text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
