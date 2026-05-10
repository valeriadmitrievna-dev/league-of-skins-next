"use client";
import { useQuery } from "@tanstack/react-query";

import EmptyCollectionDashboard from "@/emptystates/EmptyCollectionDashboard";
import { fetchClient } from "@/lib/fetchClient";

const DashboardPage = () => {
  const { data: dashboardActivity } = useQuery({
    queryKey: ["dashboard_activity"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/activity"),
  });

  console.log('[DEV]', dashboardActivity);

  return <EmptyCollectionDashboard />;
};

export default DashboardPage;
