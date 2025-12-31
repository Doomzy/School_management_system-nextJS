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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createBookSchema } from "@/lib/schemas/book";
import type { Book } from "@prisma/client";
import { schoolLevelsArray } from "@/lib/constants";

type BookFormData = z.infer<typeof createBookSchema>;

interface BookFormProps {
  initialData: Book | null;
}

export function BookForm({ initialData }: BookFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const title = initialData ? "Edit Book" : "Add New Book";
  const toastMessage = initialData
    ? "Book updated successfully!"
    : "Book created successfully!";
  const action = initialData ? "Update" : "Create";

  const form = useForm<BookFormData>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      isbn: initialData?.isbn || "",
      subject: initialData?.subject || "",
      publisher: initialData?.publisher || "",
      publishedYear: initialData?.publishedYear || undefined,
      edition: initialData?.edition || "",
      totalQuantity: initialData?.totalQuantity || 0,
      availableQty: initialData?.availableQty || 0,
      issuedQty: initialData?.issuedQty || 0,
      description: initialData?.description || "",
      coverImage: initialData?.coverImage || "",
      level: initialData?.level || undefined,
    },
  });

  const onSubmit = async (data: BookFormData) => {
    setIsLoading(true);

    try {
      const url = initialData ? `/api/books/${initialData.id}` : "/api/books";
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
      router.push("/books");
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
            {/* Book Title and Author */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Book Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Book title"
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
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Author name"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
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
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ISBN"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Publisher"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Subject"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Year"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : null
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
                  name="edition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edition</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Edition"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Book Quantities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Inventory</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="totalQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Total quantity"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableQty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Available quantity"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuedQty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issued Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Issued quantity"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Level</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schoolLevelsArray.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Book description"
                        disabled={isLoading}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/cover.jpg"
                        disabled={isLoading}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
