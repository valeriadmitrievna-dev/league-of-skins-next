import { VideoOffIcon } from "lucide-react";
import { useRef, useState, type ComponentProps, type FC } from "react";

import { cn } from "@/shared/cn";

import Skeleton from "./Skeleton";

interface VideoProps extends ComponentProps<"video"> {
  src?: string;
  showError?: boolean;
}

const Video: FC<VideoProps> = ({ src, className, showError = true, ...props }) => {
  const [state, setState] = useState<"loading" | "loaded" | "error">(src ? "loading" : "error");
  const prevSrcRef = useRef(src);

  if (src !== prevSrcRef.current) {
    prevSrcRef.current = src;
    setState(src ? "loading" : "error");
  }

  if (state === "loading") {
    return (
      <Skeleton className={cn("h-auto", className)}>
        <video
          src={src}
          className="hidden"
          onLoadedData={() => setState("loaded")}
          onError={() => setState("error")}
          preload="metadata"
        />
      </Skeleton>
    );
  }

  if (state === "error") {
    if (!showError) return null;
    return (
      <div className={cn("bg-card flex items-center justify-center", className)}>
        <VideoOffIcon className="text-card-foreground" />
      </div>
    );
  }

  return <video src={src} className={cn("select-none", className)} crossOrigin="anonymous" {...props} />;
};

export default Video;
