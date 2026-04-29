 
import type { ComponentProps, FC } from "react";

import { cn } from "@/shared/utils/cn";

const TypographyH1: FC<ComponentProps<"h1">> = ({ children, className, ...props }) => {
  return (
    <h1 {...props} className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance", className)}>
      {children}
    </h1>
  );
};

const TypographyH2: FC<ComponentProps<"h2">> = ({ children, className, ...props }) => {
  return (
    <h2 {...props} className={cn("scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0", className)}>
      {children}
    </h2>
  );
};

const TypographyH3: FC<ComponentProps<"h3">> = ({ children, className, ...props }) => {
  return (
    <h3 {...props} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
};

const TypographyH4: FC<ComponentProps<"h4">> = ({ children, className, ...props }) => {
  return (
    <h4 {...props} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>
      {children}
    </h4>
  );
};

const TypographyP: FC<ComponentProps<"p">> = ({ children, className, ...props }) => {
  return (
    <p {...props} className={cn("leading-5.5", className)}>
      {children}
    </p>
  );
};

const TypographyLarge: FC<ComponentProps<"div">> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={cn("text-lg font-semibold", className)}>
      {children}
    </div>
  );
};

const TypographySmall: FC<ComponentProps<"span">> = ({ children, className, ...props }) => {
  return (
    <span {...props} className={cn("inline-block text-sm leading-none font-medium", className)}>
      {children}
    </span>
  );
};

const TypographyMuted: FC<ComponentProps<"p">> = ({ children, className, ...props }) => {
  return (
    <p {...props} className={cn("text-muted-foreground text-sm", className)}>
      {children}
    </p>
  );
};

const TypographyCode: FC<ComponentProps<"code">> = ({ children, className, ...props }) => {
  return (
    <code
      {...props}
      className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)}
    >
      {children}
    </code>
  );
};

export const Typography = {
  H1: TypographyH1,
  H2: TypographyH2,
  H3: TypographyH3,
  H4: TypographyH4,
  P: TypographyP,
  Large: TypographyLarge,
  Small: TypographySmall,
  Muted: TypographyMuted,
  Code: TypographyCode,
};
