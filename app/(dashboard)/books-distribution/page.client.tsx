import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DistributionForm from "./components/tabs/distribution-form";
import DistributionStatusTab from "./components/tabs/distribution-status-tab";
import MissingBooksTab from "./components/tabs/missing-books-tab";

export function BookDistributionPageClient() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header
          title="Book Distribution"
          description="Manage the books distribution"
        />
        <Tabs
          defaultValue="DistributionForm"
          className="w-full bg-card rounded-md"
        >
          <TabsList>
            <TabsTrigger value="DistributionForm">
              Distribution Books
            </TabsTrigger>
            <TabsTrigger value="DistributionStatus">
              Distribution Status
            </TabsTrigger>
            <TabsTrigger value="password1">Missing Books</TabsTrigger>
          </TabsList>
          <TabsContent value="DistributionForm">
            <DistributionForm />
          </TabsContent>
          <TabsContent value="DistributionStatus">
            <DistributionStatusTab />
          </TabsContent>
          <TabsContent value="password1">
            <MissingBooksTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
