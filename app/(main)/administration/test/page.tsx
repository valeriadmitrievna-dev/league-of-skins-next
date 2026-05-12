"use client";

import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/lib/fetchClient';

const AdministrationTest = () => {
  const { data: dashboardActivity } = useQuery({
    queryKey: ["test"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/social"),
  });

  console.log("[DEV]", dashboardActivity);

  return <div>test</div>;
};

export default AdministrationTest;
