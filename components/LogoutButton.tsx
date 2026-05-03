"use client";
import useLogout from "@/hooks/useLogout";

import { Button } from "./ui/button";

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button variant="destructive" onClick={logout}>
      Logut
    </Button>
  );
};

export default LogoutButton;
