"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Year, SchoolLevel } from "@prisma/client";
import { useRouter } from "next/navigation";

const createYearFormSchema = () =>
  z.object({
    yearNumber: z
      .number()
      .min(1, "Year number must be at least 1")
      .max(12, "Year number cannot exceed 12"),
    name: z.string().min(1, "Year name is required"),
    level: z.nativeEnum(SchoolLevel),
  });

type YearFormData = z.infer<ReturnType<typeof createYearFormSchema>>;

interface YearModalProps {
  open: boolean;
  onClose: () => void;
  initialData: Year | null;
  levelFilter?: SchoolLevel;
}

export function YearModal({
  open,
  onClose,
  initialData,
  levelFilter,
}: YearModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const title = initialData ? "Edit Year" : "Create a new year";
  const toastMessage = initialData
    ? "Year updated successfully!"
    : "New year created successfully!";
  const action = initialData ? "Update" : "Create";

  const yearFormSchema = createYearFormSchema();

  const form = useForm<YearFormData>({
    resolver: zodResolver(yearFormSchema),
    defaultValues: {
      yearNumber: initialData?.yearNumber || 1,
      name: initialData?.name || "",
      level:
        (initialData?.level as YearFormData["level"]) ||
        (levelFilter as YearFormData["level"]) ||
        "",
    },
  });

  // Reset form values whenever modal opens or the incoming data/levelFilter change
  useEffect(() => {
    const defaults: YearFormData = {
      yearNumber: initialData?.yearNumber || 1,
      name: initialData?.name || "",
      level:
        (initialData?.level as YearFormData["level"]) ||
        (levelFilter as YearFormData["level"]) ||
        "",
    };

    form.reset(defaults);
  }, [open, initialData, levelFilter, form]);

  const onSubmit = async (data: YearFormData) => {
    setIsLoading(true);

    try {
      const submitData = initialData
        ? { url: `/api/years/${initialData.id}`, method: "PATCH" }
        : { url: "/api/years", method: "POST" };

      const response = await fetch(submitData.url, {
        method: submitData.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "An error occurred during submission"
        );
      }

      toast.success(toastMessage);
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-xs mb-2 text-muted-foreground sm:text-sm">
            Add a new year to the {form.getValues("level").toLocaleLowerCase()}{" "}
            level
          </p>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="yearNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        disabled={isLoading}
                        placeholder="e.g., 1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Grade 1"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={onClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "..." : action}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
