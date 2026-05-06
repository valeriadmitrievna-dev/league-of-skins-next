"use client";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

const AdminNavLink = () => {

  if (config.nodeEnv === "development") {
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
