// import { cookies } from "next/headers";
// import ru from "@/locales/ru.locale.json";
// import en from "@/locales/en.locale.json";

// export type Dictionary = typeof ru | typeof en;

// const dictionaries = { ru, en };

// export const getLocale = async () => {
//   const cookieStore = await cookies();
//   const saved = cookieStore.get("language")?.value;
//   if (saved === "ru" || saved === "en") return saved;

//   const { headers } = await import("next/headers");
//   const headerStore = await headers();
//   const acceptLanguage = headerStore.get("accept-language") ?? "";
//   const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();

//   return preferred ?? "en";
// };

// export const getDictionary = async (): Promise<Dictionary> => {
//   const locale = await getLocale();
//   return dictionaries[locale as keyof typeof dictionaries] ?? dictionaries.en;
// };
