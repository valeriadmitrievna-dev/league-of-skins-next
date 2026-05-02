"use client";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { useUser } from "@/shared/providers/UserProvider";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";

const AdminNavLink = () => {
  const { user } = useUser();
  console.log("[DEV]", user);

  if (user?.role === "admin" || config.nodeEnv === "development") {
    return (
      <Button variant="outline" size="icon" asChild>
        <Link href="/administration">
          <ShieldAlertIcon />
        </Link>
      </Button>
    );
  }

  return null;
};

export default AdminNavLink;
