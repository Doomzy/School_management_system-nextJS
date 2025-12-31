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
  FormDescription,
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
import { Class } from "./table/columns";

const createClassFormSchema = () =>
  z.object({
    section: z.string().min(1, "Provide a class section"),
    name: z.string().min(1, "Class name is required"),
    capacity: z.number().min(1, "Class capacity is required"),
    roomNumber: z.string().optional(),
  });

type ClassFormData = z.infer<ReturnType<typeof createClassFormSchema>>;

interface ClassModalProps {
  open: boolean;
  onClose: () => void;
  yearId: string;
  initialData: Class | null;
}

export function ClassModal({
  open,
  onClose,
  yearId,
  initialData,
}: ClassModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const title = initialData ? "Edit class info." : "Create a new class";
  const toastMessage = initialData
    ? "Class updated successfully!"
    : "New class added successfully!";
  const action = initialData ? "Update" : "Create";
  const submitData = initialData
    ? { url: `/api/classes/${initialData.id}`, method: "PATCH" }
    : { url: "/api/classes", method: "POST" };

  const classFormSchema = createClassFormSchema();

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      section: initialData?.section || "",
      name: initialData?.name || "",
      capacity: initialData?.capacity || 0,
      roomNumber: initialData?.roomNumber || undefined,
    },
  });

  const onSubmit = async (data: ClassFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch(submitData.url, {
        method: submitData.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: data.section,
          name: data.name,
          capacity: data.capacity,
          roomNumber: data.roomNumber,
          yearId: yearId,
        }),
      });

      if (!response.ok) {
        throw new Error("An error occurred during submission");
      }

      toast.success(toastMessage);
      onClose();
      form.reset();
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Section</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"A, B, C, etc."} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={`e.g., "Grade 1-A"`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      max={50}
                      placeholder={"Add maximum number of students"}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of students in this class
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 101"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
