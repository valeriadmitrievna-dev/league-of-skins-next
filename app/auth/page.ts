import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAccessToken } from "@/lib/auth";

const AuthPage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const isAuth = !!verifyAccessToken(accessToken ?? "");

  if (isAuth) return redirect("/collection");

  return redirect("/auth/signin");
};

export default AuthPage;
