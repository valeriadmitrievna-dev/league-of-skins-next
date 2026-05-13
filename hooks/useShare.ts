import { useCallback } from "react";
import { toast } from "sonner";

interface Messages {
  success?: string;
  error?: string;
}

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

const useShare = () => {
  const isShareSupported = typeof navigator !== "undefined" && !!navigator.share;

  const copyToClipboard = useCallback(async (text: string, messages?: Messages): Promise<boolean> => {
    if (!navigator.clipboard) {
      console.warn("Clipboard API не поддерживается");

      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        if (messages?.success) {
          toast.success(messages.success);
        }
        return true;
      } catch (err) {
        console.error("Ошибка при использовании execCommand:", err);

        if (messages?.error) {
          toast.error(messages.error);
        }

        return false;
      }
    }

    try {
      await navigator.clipboard.writeText(text);

      if (messages?.success) {
        toast.success(messages.success);
      }

      return true;
    } catch (error) {
      console.error("Ошибка при копировании:", error);

      if (messages?.error) {
        toast.error(messages.error);
      }

      return false;
    }
  }, []);

  const copyLink = useCallback(
    async (url?: string, messages?: Messages): Promise<boolean> => {
      const linkToCopy = url || window.location.href;
      return copyToClipboard(linkToCopy, messages);
    },
    [copyToClipboard],
  );

  const share = useCallback(
    async (data: ShareData = {}, messages?: Messages): Promise<void> => {
      const shareUrl = data.url || window.location.href;
      const shareTitle = data.title || document.title;

      if (isShareSupported) {
        try {
          await navigator.share({
            title: shareTitle,
            text: data.text,
            url: shareUrl,
          });

          if (messages?.success) {
            toast.success(messages.success);
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === "AbortError" || error.name === "CanceledError") {
              return;
            }

            console.error("Ошибка при вызове Web Share API:", error);

            await copyToClipboard(shareUrl, messages);
          }
        }
      } else {
        await copyToClipboard(shareUrl);
      }
    },
    [isShareSupported, copyToClipboard],
  );

  return {
    share,
    copyLink,
    isShareSupported,
  };
};

export default useShare;
