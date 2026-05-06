import { FC } from "react";

import { cn } from '@/shared/cn';

import Background from "./Background";
import { Spinner } from "./ui/spinner";

const LoadingScreen: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("w-full h-screen flex items-center justify-center bg-background", className)}>
      <Background />
      <Spinner className="size-10 text-primary" />
    </div>
  );
};

export default LoadingScreen;
