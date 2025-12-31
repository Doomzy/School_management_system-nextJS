import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

export default function Page() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      icon: Users,
      change: "+5.2%",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                Welcome back, Admin
              </h1>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {new Date().toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    <span
                      className={
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>{" "}
                    from last week
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
