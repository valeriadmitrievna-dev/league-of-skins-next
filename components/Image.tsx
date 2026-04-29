import { ImageOffIcon } from "lucide-react";
import { useState, type ComponentProps, type FC } from "react";

import Skeleton from "./Skeleton";
import { cn } from '@/shared/cn';

interface ImageProps extends ComponentProps<"img"> {
  pulseLoading?: boolean;
  showError?: boolean;
}

const Image: FC<ImageProps> = ({ src, className, style, pulseLoading = true, showError = true, ...props }) => {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <>
      <img
        src={src}
        className={cn("select-none pointer-events-none", className)}
        onLoadStart={() => setState("loading")}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        style={{ display: state === "loading" || state === "error" ? "none" : "block", ...style }}
        crossOrigin="anonymous"
        {...props}
      />

      {state === "error" && showError && (
        <div className={cn("bg-card flex items-center justify-center", className)}>
          <ImageOffIcon className="text-card-foreground" />
        </div>
      )}

      {state === "loading" && <Skeleton pulse={pulseLoading} className={cn("h-auto", className)} style={style} />}
    </>
  );
};

export default Image;
