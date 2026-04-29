type PluralForm = "one" | "few" | "many" | "other";

export const getPluralForm = (count: number): PluralForm => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 19) return "many";
  if (mod10 === 1) return "one";
  if (mod10 >= 2 && mod10 <= 4) return "few";
  return "many";
};

export const plural = (count: number, forms: Record<string, string>) => {
  const form = getPluralForm(count);
  return forms[`_${form}`] ?? forms["_other"] ?? "";
};
