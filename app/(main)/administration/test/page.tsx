"use client";

import { useQuery } from '@tanstack/react-query';

import { fetchClient } from '@/lib/fetchClient';

const AdministrationTest = () => {
  const { data } = useQuery({
    queryKey: ["test"],
    queryFn: () => fetchClient("/api/user/collection/dashboard/spending"),
  });

  console.log("[DEV]", data);

  return <div>test</div>;
};

export default AdministrationTest;
