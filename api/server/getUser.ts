import { cookies, headers } from "next/headers";

import { DbUser } from "@/types/db";

export const getUser = async () => {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/user`, {
      headers: {
        cookie: cookieStore.toString(),
      },
      credentials: "include",
    });
    const user: DbUser = await res.json();
    return user;
  } catch (error) {
    return null;
  }
};
