"use client";

import { Edit, MoreHorizontal, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Class } from "./columns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassModal } from "../class-modal";
import { AlertModal } from "@/components/alert-modal";

interface CellActionProps {
  data: Class;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
          "Are you sure you want to delete this class? " + `[${data.name}]`
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
            onClick={() => setIsEditOpen(true)}
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

      {/* Edit Class Dialog */}
      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="mb-4 flex items-center text-xl font-bold">
              Edit Class
            </Dialog.Title>
            <Dialog.Close className="absolute right-3 top-3">
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </Dialog.Close>
            <div className="mt-4">
              <ClassModal
                initialData={data}
                onClose={() => setIsEditOpen(false)}
                open={isEditOpen}
                yearId={data.yearId}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
