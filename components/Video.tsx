import { VideoOffIcon } from "lucide-react";
import { useEffect, useState, type ComponentProps, type FC } from "react";

import { cn } from "@/shared/utils/cn";

import Skeleton from "./Skeleton";

interface VideoProps extends ComponentProps<"video"> {
  showError?: boolean;
}

const Video: FC<VideoProps> = ({ src, className, showError = true, ...props }) => {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  const loadVideo = async () => {
    try {
      await fetch(src!);
      setState("loaded");
    } catch (error) {
      setState("error");
    }
  };

  useEffect(() => {
    if (!src) {
      setState("error");
      return;
    }
    loadVideo();
  }, [src]);

  if (state === "loading") {
    return <Skeleton className={cn("h-auto", className)} />;
  }

  if (state === "error" && showError) {
    return (
      <div className={cn("bg-card flex items-center justify-center", className)}>
        <VideoOffIcon className="text-card-foreground" />
      </div>
    );
  }

  return <video src={src} className={cn("select-none", className)} crossOrigin="anonymous" {...props} />;
};

export default Video;
