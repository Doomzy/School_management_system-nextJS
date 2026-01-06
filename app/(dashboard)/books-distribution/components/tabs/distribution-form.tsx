"use client";

import { Button } from "@/components/ui/button";
import { schoolLevelsArray } from "@/lib/constants";
import { CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DistributionStatus, SchoolLevel } from "@prisma/client";
import {
  ClassWithStudentsCount,
  getClassesByLevel,
} from "../../_actions/getClassesByLevel";

interface StudentBookDistribution {
  studentId: string;
  bookId: string;
  status: DistributionStatus;
}

function DistributionForm() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [levelsClasses, setLevelsClasses] = useState<
    ClassWithStudentsCount[] | []
  >([]);

  const [selectedClass, setSelectedClass] = useState<
    ClassWithStudentsCount | undefined
  >();
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [distributionStatuses, setDistributionStatuses] = useState<
    Record<string, DistributionStatus>
  >({}); // Key: "${studentId}-${bookId}"

  async function fetchDataClasses(newLevel: string) {
    if (newLevel == selectedLevel) return;

    try {
      setSelectedLevel(newLevel);

      const data = await getClassesByLevel(newLevel as SchoolLevel);
      if (data.length == 0) {
        toast.error("No classes found for the selected level");
      }
      setLevelsClasses(data);
    } catch {
      setSelectedLevel("");
      setLevelsClasses([]);
      toast.error("An unexpected error occurred");
    } finally {
      setSelectedClass(undefined);
      setSelectedBooks([]);
    }
  }

  const handleBookToggle = (bookId: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const getStudentProgress = (
    studentDistributions: {
      bookId: string;
      status: DistributionStatus;
    }[]
  ) => {
    if (!selectedBooks.length) return { received: 0, total: 0 };
    const received = selectedBooks.filter(
      (bookId) =>
        studentDistributions.find((book) => book.bookId === bookId)?.status ===
        "RECEIVED"
    ).length;
    return { received, total: selectedBooks.length };
  };

  const getDistributionStatus = (
    studentId: string,
    bookId: string,
    existingStatus: DistributionStatus
  ): DistributionStatus => {
    const key = `${studentId}-${bookId}`;
    return distributionStatuses[key] ?? existingStatus;
  };

  const toggleDistributionStatus = (studentId: string, bookId: string) => {
    const key = `${studentId}-${bookId}`;
    const currentStatus = distributionStatuses[key] ?? "PENDING";
    const nextStatus: DistributionStatus =
      currentStatus === "PENDING"
        ? "RECEIVED"
        : currentStatus === "RECEIVED"
        ? "NOT_RECEIVED"
        : "PENDING";

    setDistributionStatuses((prev) => ({
      ...prev,
      [key]: nextStatus,
    }));
  };

  const markAllAsReceived = () => {
    if (!selectedClass) return;

    const updates: Record<string, DistributionStatus> = {};
    selectedClass.students.forEach((student) => {
      selectedBooks.forEach((bookId) => {
        const key = `${student.id}-${bookId}`;
        updates[key] = "RECEIVED";
      });
    });

    setDistributionStatuses((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const submitDistributions = async () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (selectedBooks.length === 0) {
      toast.error("Please select at least one book");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare distribution data
      const distributions: StudentBookDistribution[] =
        selectedClass.students.flatMap((student) =>
          selectedBooks.map((bookId) => ({
            studentId: student.id,
            bookId,
            status: getDistributionStatus(
              student.id,
              bookId,
              student.bookDistributions.find((b) => b.bookId === bookId)
                ?.status || "PENDING"
            ),
          }))
        );

      const response = await fetch("/api/books/distribution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(distributions),
      });

      if (!response.ok) {
        throw new Error("Failed to submit distributions");
      }

      toast.success("Book distributions submitted successfully!");

      // Reset form
      setSelectedLevel("");
      setLevelsClasses([]);
      setSelectedClass(undefined);
      setSelectedBooks([]);
      setDistributionStatuses({});
    } catch (error) {
      console.error("Error submitting distributions:", error);
      toast.error("Failed to submit distributions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Select Level */}
      <div>
        <StepTitle title="Select Level" stepNo={1} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schoolLevelsArray.map((level) => (
            <Button
              variant={selectedLevel == level.value ? "selected" : "outline"}
              key={level.value}
              onClick={() => fetchDataClasses(level.value)}
            >
              <level.icon />
              {level.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Class */}
      {selectedLevel && levelsClasses.length > 0 && (
        <div>
          <StepTitle title="Select Class" stepNo={2} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levelsClasses.map((classItem) => (
              <div
                key={classItem.id}
                onClick={() => {
                  if (classItem.students.length == 0) {
                    toast.error("This class has no students");
                    setSelectedClass(undefined);
                    setSelectedBooks([]);
                    return;
                  }
                  setSelectedClass(classItem);
                }}
                className={`p-4 border-2 rounded-lg cursor-pointer ${
                  selectedClass?.id === classItem.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {classItem.name}
                  </h4>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">{classItem.year.level}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {classItem.students.length} students
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Select Books */}
      {selectedClass && (
        <div>
          <StepTitle title="Select Books to Distribute" stepNo={3} />

          <div className="space-y-3">
            {selectedClass.year.books.map((book) => (
              <label
                key={book.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedBooks.includes(book.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedBooks.includes(book.id)}
                  onChange={() => handleBookToggle(book.id)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {book.title}
                      </p>
                      <p className="text-sm text-gray-500">{book.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Available: {book.availableQty}/{book.totalQuantity}
                      </p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (book.availableQty / book.totalQuantity) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Student Checklist */}
      {selectedClass && selectedBooks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <StepTitle title="Student Distribution Checklist" stepNo={4} />
            <div className="flex gap-2">
              <Button onClick={markAllAsReceived} variant={"outline"}>
                <CheckCircle className="w-4 h-4" />
                Mark All as Received
              </Button>
              <Button
                onClick={submitDistributions}
                disabled={isSubmitting}
                variant={"success"}
              >
                {isSubmitting ? "Submitting..." : "Submit Distributions"}
              </Button>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-3">
            {selectedClass.students.map((student) => {
              const progress = getStudentProgress(student.bookDistributions);
              return (
                <div
                  key={student.id}
                  className="p-4 border rounded-lg bg-gray-50 border-gray-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.enrollmentNo}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {progress.received}/{progress.total} books received
                      </p>
                    </div>
                  </div>

                  {/* Book Checkboxes */}
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBooks.map((bookId) => {
                      const book = selectedClass.year.books.find(
                        (b) => b.id === bookId
                      );

                      if (!book) return null;

                      const status = getDistributionStatus(
                        student.id,
                        bookId,
                        student.bookDistributions.find(
                          (book) => book.bookId == bookId
                        )?.status || "PENDING"
                      );

                      return (
                        <div key={bookId} className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleDistributionStatus(student.id, bookId)
                            }
                            className={`flex-1 p-2 rounded-lg text-sm transition-all ${
                              status === "RECEIVED"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : status === "NOT_RECEIVED"
                                ? "bg-red-100 text-red-800 border border-red-300"
                                : "bg-gray-100 text-gray-600 border border-gray-300"
                            } `}
                          >
                            <div className="flex items-center gap-2">
                              {status === "RECEIVED" && (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              {status === "NOT_RECEIVED" && (
                                <XCircle className="w-4 h-4" />
                              )}
                              {status === "PENDING" && (
                                <Clock className="w-4 h-4" />
                              )}
                              <span className="truncate">{book.title}</span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DistributionForm;

function StepTitle({ title, stepNo }: { title: string; stepNo: number }) {
  return (
    <h3 className="text-base font-semibold mb-4">
      Step {stepNo}: {title}
    </h3>
  );
}
