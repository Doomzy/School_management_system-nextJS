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
import { createStudentSchema } from "@/lib/schemas/student";
import type { Class, SchoolLevel, Student } from "@prisma/client";

type StudentFormData = z.infer<typeof createStudentSchema>;

interface StudentFormProps {
  initialData: (Student & { class: Class }) | null;
  classes: (Class & { year: { level: SchoolLevel; yearNumber: number } })[];
}

export function StudentForm({ initialData, classes }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get the initial level and year from the student's class if editing
  const getInitialLevelAndYear = () => {
    if (initialData && initialData.classId) {
      const classData = classes.find((cls) => cls.id === initialData.classId);
      if (classData) {
        return {
          level: classData.year.level,
          year: classData.year.yearNumber,
        };
      }
    }
    return { level: null, year: null };
  };

  const initial = getInitialLevelAndYear();
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | null>(
    initial.level
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(initial.year);

  const title = initialData ? "Edit Student" : "Add New Student";
  const toastMessage = initialData
    ? "Student updated successfully!"
    : "Student created successfully!";
  const action = initialData ? "Update" : "Create";

  // Get unique levels
  const levels = Array.from(
    new Set(classes.map((cls) => cls.year.level))
  ) as SchoolLevel[];

  // Get years for selected level
  const years = selectedLevel
    ? Array.from(
        new Set(
          classes
            .filter((cls) => cls.year.level === selectedLevel)
            .map((cls) => cls.year.yearNumber)
        )
      ).sort((a, b) => a - b)
    : [];

  // Get classes for selected level and year
  const filteredClasses =
    selectedLevel && selectedYear
      ? classes.filter(
          (cls) =>
            cls.year.level === selectedLevel &&
            cls.year.yearNumber === selectedYear
        )
      : [];

  const form = useForm<StudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      classId: initialData?.classId || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      dateOfBirth: initialData?.dateOfBirth
        ? initialData.dateOfBirth.toISOString().split("T")[0]
        : "",
      gender: initialData?.gender || "",
      enrollmentNo: initialData?.enrollmentNo || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      guardianName: initialData?.guardianName || "",
      guardianPhone: initialData?.guardianPhone || "",
      address: initialData?.address || "",
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);

    try {
      const url = initialData
        ? `/api/students/${initialData.id}`
        : "/api/students";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          dateOfBirth: new Date(data.dateOfBirth),
        }),
      });

      if (!response.ok) {
        throw new Error("An error occurred during submission");
      }

      toast.success(toastMessage);
      router.push("/students");
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
            {/* Class Selection - Hierarchical */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Class Selection</h3>

              <div className="grid gap-2 grid-cols-3">
                {/* Level Selection */}
                <FormItem>
                  <FormLabel>Level *</FormLabel>
                  <Select
                    value={selectedLevel || ""}
                    onValueChange={(value) => {
                      setSelectedLevel(value as SchoolLevel);
                      setSelectedYear(null);
                      form.setValue("classId", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                {/* Year Selection */}
                <FormItem>
                  <FormLabel>Year *</FormLabel>
                  <Select
                    value={selectedYear?.toString() || ""}
                    onValueChange={(value) => {
                      setSelectedYear(Number(value));
                      form.setValue("classId", "");
                    }}
                    disabled={!selectedLevel}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                {/* Class Selection */}
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedYear}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredClasses.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
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
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Enrollment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Enrollment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="enrollmentNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enrollment Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enrollment number"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="student@example.com"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guardian Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Guardian Information</h3>
              <FormField
                control={form.control}
                name="guardianName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Guardian's name"
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
                name="guardianPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian Phone *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Guardian's phone number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full address"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
