import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const ToastsProvider = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "0",
          "--toast-close-button-transform": "translate(35%, -35%)"
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast px-4! py-2! border-foreground/20!",
          icon: 'mt-[2px] mr-0! self-start!',
          description: 'text-[12px]/[14px]! mt-1! pb-1',
        },
      }}
      position="bottom-left"
      {...props}
    />
  );
};

export default ToastsProvider;
