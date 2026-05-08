"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { useEffect } from "react";

import DiamondBackground from "@/components/DiamondBackground";
import { fetchClient } from "@/lib/fetchClient";

const VerifyEmailPage = () => {
  const { t } = useT("email-verification");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const fromParam = searchParams.get("from");
  const from = fromParam ? decodeURIComponent(fromParam) : null;

  const {
    mutate: verify,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: () => fetchClient(`/api/auth/verify-email?token=${token}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setTimeout(() => router.push(from || "/search/skins"), 2500);
    },
  });

  useEffect(() => {
    if (token) verify();
  }, [token]);

  return (
    <DiamondBackground className="w-full h-screen overflow-hidden flex items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        {isPending || (!isSuccess && !isError && <p className="text-muted-foreground animate-pulse">{t("pending")}</p>)}
        {isSuccess && (
          <>
            <CheckCircleIcon className="w-12 h-12 text-success" />
            <h2 className="text-xl font-bold">{t("success")}</h2>
            <p className="text-muted-foreground animate-pulse">{t("success-redirect")}</p>
          </>
        )}
        {isError && (
          <>
            <XCircleIcon className="w-12 h-12 text-destructive" />
            <h2 className="text-xl font-bold">{t("error")}</h2>
            <p className="text-muted-foreground">{t("error-text")}</p>
          </>
        )}
      </div>
    </DiamondBackground>
  );
};

export default VerifyEmailPage;
