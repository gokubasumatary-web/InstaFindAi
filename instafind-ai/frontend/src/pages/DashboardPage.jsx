import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const DashboardPage = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted">
              Dashboard coming soon! This section will show your search history,
              saved accounts, and top categories.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};