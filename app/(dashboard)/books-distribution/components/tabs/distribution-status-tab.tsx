import { calculatePercentage, getProgressColor } from "@/lib/utils";
import { ExpandableRow } from "../expandable-row";
import { getSchoolBookDistributionReport } from "../../_actions/getDistributionStatus";
import { BookOpen } from "lucide-react";

async function DistributionStatusTab() {
  const distributionData = await getSchoolBookDistributionReport();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">
          Distribution Progress by Level
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Track books distribution progress across all levels
        </p>
      </div>
      <div className="bg-white">
        {distributionData.map((level) => {
          return (
            <ExpandableRow
              key={level.id}
              title={level.name}
              subtitle={`${level.totalStudents} students in total`}
              stats={level.icon}
              isExpandable={level.totalStudents > 0}
            >
              {/* Children (The Years) */}
              <div className="bg-gray-50">
                {level.years.map((year) => {
                  const yearPercentage = calculatePercentage(
                    year.completedStudents,
                    year.totalStudents
                  );

                  return (
                    <ExpandableRow
                      key={year.id}
                      indentation="p-6 pl-16"
                      title={year.name}
                      subtitle={`${year.completedStudents}/${year.totalStudents} students`}
                      isExpandable={year.totalStudents > 0}
                      stats={
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {yearPercentage}%
                          </p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(
                                yearPercentage
                              )}`}
                              style={{ width: `${yearPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      }
                    >
                      {/* Children (The Classes) */}
                      <div className="bg-white">
                        {year.classes.map((classItem) => {
                          const classPercentage = calculatePercentage(
                            classItem.completed,
                            classItem.students
                          );
                          return (
                            <ExpandableRow
                              indentation="pl-20 p-6"
                              key={classItem.id}
                              title={classItem.name}
                              subtitle={`${classItem.completed}/${classItem.students} students`}
                              isExpandable={classItem.students > 0}
                              stats={
                                <div className="text-right">
                                  <p className="text-xl font-bold text-gray-900">
                                    {classPercentage}%
                                  </p>
                                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                                    <div
                                      className={`h-2 rounded-full ${getProgressColor(
                                        classPercentage
                                      )}`}
                                      style={{ width: `${classPercentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              }
                            >
                              {classItem.books.length > 0 && (
                                <div className="pl-24 pr-6 pb-6 bg-gray-50">
                                  <div className="grid grid-cols-2 gap-3">
                                    {classItem.books.map((book, bookIndex) => {
                                      const bookPercentage =
                                        calculatePercentage(
                                          book.distributed,
                                          book.total
                                        );
                                      return (
                                        <div
                                          key={bookIndex}
                                          className="bg-white p-4 rounded-lg border border-gray-200"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <BookOpen className="w-4 h-4 text-gray-400" />
                                              <span className="text-sm font-medium text-gray-900">
                                                {book.title}
                                              </span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                              {book.distributed}/{book.total}
                                            </span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                              className={`h-2 rounded-full ${getProgressColor(
                                                bookPercentage
                                              )}`}
                                              style={{
                                                width: `${bookPercentage}%`,
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </ExpandableRow>
                          );
                        })}
                      </div>
                    </ExpandableRow>
                  );
                })}
              </div>
            </ExpandableRow>
          );
        })}
      </div>
    </div>
  );
}

export default DistributionStatusTab;
