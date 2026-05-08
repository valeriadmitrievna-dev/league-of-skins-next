"use client";
import { LogOutIcon } from "lucide-react";

import useLogout from "@/hooks/useLogout";

import { Button } from "./ui/button";

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button variant="destructive" size="icon-xl" onClick={logout} className="bg-transparent! hover:bg-destructive/20!">
      <LogOutIcon />
    </Button>
  );
};

export default LogoutButton;
