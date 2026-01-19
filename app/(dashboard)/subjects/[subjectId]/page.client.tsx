"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Subject } from "@prisma/client";
import { createSubjectSchema } from "@/lib/schemas/subject";
import ColorPickerDropdown from "@/components/color-picker-dropdown";

type SubjectFormData = z.infer<typeof createSubjectSchema>;

interface SubjectFormProps {
  initialData: Subject | null;
}

export function SubjectPage({ initialData }: SubjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const title = initialData ? "Edit Subject" : "Add New Subject";
  const toastMessage = initialData
    ? "Subject updated successfully!"
    : "Subject created successfully!";
  const action = initialData ? "Update" : "Create";

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      color: initialData?.color || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: SubjectFormData) => {
    setIsLoading(true);

    try {
      const url = initialData
        ? `/api/subjects/${initialData.id}`
        : "/api/subjects";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("An error occurred during submission");
      }

      toast.success(toastMessage);
      router.push("/subjects");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Subject Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Subject Name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Subject Code"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Description"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ColorPickerDropdown
                  value={form.watch("color")}
                  onChange={(color: string) => form.setValue("color", color)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => window.history.back()}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "..." : action}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
