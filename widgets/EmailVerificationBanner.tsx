"use client";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useT } from "next-i18next/client";
import { FC, useState } from "react";
import { toast } from "sonner";

import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { fetchClient } from "@/lib/fetchClient";
import { cn } from "@/shared/cn";
import { WithClassName } from "@/shared/types";

const EmailVerificationBanner: FC<WithClassName> = ({ className }) => {
  const { t } = useT("email-verification");
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  const {
    mutate: resend,
    isPending,
    data,
  } = useMutation<{ ok: true }>({
    mutationFn: () => fetchClient(`/api/auth/resend-verification?from=${pathname}`, { method: "POST" }),
    onSuccess: () => toast.success(t("resend-success")),
    onError: () => toast.error(t("resend-error")),
  });

  if (dismissed) return null;

  return (
    <div className={cn("px-5 py-4 bg-warning/10 rounded-lg border border-warning/30 relative", className)}>
      <Button size="icon-sm" variant="ghost" onClick={() => setDismissed(true)} className="absolute top-3.25 right-4">
        <XIcon />
      </Button>
      <Typography.P className="font-medium mb-1">{t("title")}</Typography.P>
      <Typography.Muted className="font-normal max-w-200 mb-2">{t("banner")}</Typography.Muted>
      <Button
        variant="ghost"
        onClick={() => resend()}
        disabled={isPending}
        className="flex p-0! bg-transparent! h-fit! text-foreground hover:underline"
      >
        {!data?.ok && (isPending ? t("resend-pending") : t("resend"))}
      </Button>
    </div>
  );
};

export default EmailVerificationBanner;

// // Добавить импорт
// import EmailVerificationBanner from "@/components/EmailVerificationBanner";

// // Заменить:
// const userId = await getServerUserId();
// // На:
// const userId = await getServerUserId();
// const isVerified = userId ? await getIsVerified(userId) : true;
