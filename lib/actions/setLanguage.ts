"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const setLanguage = async (lang: string) => {
  const cookieStore = await cookies();
  cookieStore.set("language", lang, { path: "/" });
  revalidatePath("/", "layout");
};
