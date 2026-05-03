"use client";

import { AlertTriangleIcon } from "lucide-react";
import { type FC } from "react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: FC<ErrorPageProps> = ({ error, reset }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <AlertTriangleIcon className="size-12 text-destructive" />
        <h1 className="text-2xl font-semibold">Что-то пошло не так</h1>
        <p className="text-muted-foreground max-w-md">
          {error.message || "Произошла непредвиденная ошибка. Попробуйте обновить страницу."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Попробовать снова</Button>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          На главную
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;