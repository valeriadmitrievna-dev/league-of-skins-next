"use client";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useT } from "next-i18next/client";
import { FC, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    <Alert className={cn("w-full  bg-amber-500/10 border-amber-500/50", className)}>
      <AlertTitle className="text-amber-600">{t("title")}</AlertTitle>
      <AlertDescription>
        {t("banner")}
        <Button
          variant="ghost"
          onClick={() => resend()}
          disabled={isPending}
          className="flex px-0! pt-1! bg-transparent! h-fit! -mb-2 text-foreground hover:underline"
        >
          {!data?.ok && (isPending ? t("resend-pending") : t("resend"))}
        </Button>
      </AlertDescription>
      <AlertAction>
        <Button size="icon-sm" variant="ghost" onClick={() => setDismissed(true)}>
          <XIcon />
        </Button>
      </AlertAction>
    </Alert>
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
