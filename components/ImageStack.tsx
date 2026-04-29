import { type FC } from "react";

import { cn } from "@/shared/utils/cn";

import Image from "./Image";

type ImageStackProps = {
  images: string[];
  className?: string;
};

export const ImageStack: FC<ImageStackProps> = ({ images, className }) => {
  const count = images.length;

  if (count === 1) {
    return (
      <div className={cn("h-40 w-full overflow-hidden", className)}>
        <Image src={images[0]} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden h-40 bg-background grid", className)}
      style={{ gridTemplateColumns: `repeat(${images.length ?? 1}, 1fr)` }}
    >
      {images.map((url, index) => {
        const part = 100 / (count - 1);
        const isFirst = index === 0;
        const isLast = index === count - 1;

        return (
          <Image
            key={url}
            src={url ?? ""}
            pulseLoading={false}
            showError={false}
            className={cn("h-full object-cover absolute origin-top transition-transform", {
              "scale-140 -translate-x-[50%]": count > 1,
              "w-full": count === 1,
              "-translate-x-[35%] group-hover:-translate-x-[50%] z-2": isFirst && count > 2,
              "-translate-x-[65%] group-hover:-translate-x-[50%] z-2": isLast && count > 2,
              "-translate-x-[45%] group-hover:-translate-x-[50%] z-1": count === 5 && index === 1,
              "-translate-x-[55%] group-hover:-translate-x-[50%] z-1": count === 5 && index === 3,
            })}
            style={
              count === 1
                ? {}
                : {
                    clipPath: "polygon(25% 0,100% 0,75% 100%,0 100%)",
                    width: `${part}%`,
                    left: `${index * part}%`,
                  }
            }
          />
        );
      })}
    </div>
  );
};
