import crypto from "crypto";

import { sendVerificationEmail } from "./mailer";
import { createClient } from "./supabase/server";

/**
 * Создаёт новый токен верификации и отправляет письмо.
 * Старые токены для этого пользователя удаляются перед вставкой.
 */
export const createAndSendVerification = async (userId: string, email: string, from?: string) => {
  const supabase = await createClient();

  // Удаляем старые токены — один активный токен на пользователя
  await supabase.from("email_verifications").delete().eq("user_id", userId);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("email_verifications").insert({
    user_id: userId,
    token,
    expires_at: expiresAt,
  });

  if (error) throw new Error("Failed to create verification token");

  await sendVerificationEmail(email, token, from);
};
