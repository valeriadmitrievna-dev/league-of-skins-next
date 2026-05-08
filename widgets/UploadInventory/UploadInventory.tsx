"use client";
import { useMutation } from "@tanstack/react-query";
import { AlertCircleIcon, CheckIcon, CloudUploadIcon, FileJsonIcon, UploadIcon } from "lucide-react";
import { Trans, useT } from "next-i18next/client";
import { ChangeEvent, FC, PropsWithChildren, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { fetchClient } from "@/lib/fetchClient";
import { cn } from "@/shared/cn";

const SCRIPT_RELEASE_URL = "https://github.com/valeriadmitrievna-dev/league-of-skins-inventory";
const FEEDBACK_FORM_URL = "https://forms.gle/WpiGodbBcs9cRV7M7";
const DIRECT_MESSAGE_URL = "https://t.me/+nBzwgyuff9pkMjUy";

interface UploadInventoryProps extends PropsWithChildren {
  //
}

const UploadInventory: FC<UploadInventoryProps> = ({ children }) => {
  const { t } = useT();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return fetchClient("/api/inventory", {
        method: "POST",
        body: formData,
      });
    },
  });

  const openChangeHandler = (next: boolean) => {
    if (!next) {
      setFile(null);
    }
    setOpen(next);
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    e.target.value = "";
  };

  const uploadHandler = async () => {
    if (!file) return;
    await mutateAsync(file);
  };

  return (
    <Dialog open={open} onOpenChange={openChangeHandler}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <CloudUploadIcon />
            {t("uploadInventory.button")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn("w-full max-w-xl!", {
          "animate-pulse! pointer-events-none!": isPending,
        })}
      >
        <DialogHeader>
          <DialogTitle>{t("uploadInventory.button")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2 w-full overflow-hidden">
          <section className="flex flex-col gap-1.5">
            <h4 className="text-sm font-medium">{t("uploadInventory.howItWorks_title")}</h4>
            <p className="text-sm text-muted-foreground">{t("uploadInventory.howItWorks_text")}</p>
          </section>

          <section className="flex flex-col gap-3">
            <h4 className="text-sm font-medium">{t("uploadInventory.steps_title")}</h4>
            <ol className="flex flex-col gap-3">
              <li className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t("uploadInventory.steps_download")}</span>
                <span className="text-sm text-muted-foreground">
                  <Trans
                    i18nKey="uploadInventory.steps_download_note"
                    ns="inventory"
                    components={[
                      <a
                        key="0"
                        href={SCRIPT_RELEASE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-foreground transition-colors"
                      />,
                    ]}
                  />
                </span>
              </li>

              <li className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t("uploadInventory.steps_run")}</span>
                <span className="text-sm text-muted-foreground">{t("uploadInventory.steps_run_note")}</span>
              </li>

              <li className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t("uploadInventory.steps_file")}</span>
                <span className="text-sm text-muted-foreground">
                  <Trans
                    i18nKey="uploadInventory.steps_file_note"
                    ns="inventory"
                    components={{ code: <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded" /> }}
                  />
                </span>
              </li>

              <li className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t("uploadInventory.steps_upload")}</span>
                <span className="text-sm text-muted-foreground">
                  <Trans
                    i18nKey="uploadInventory.steps_upload_note"
                    ns="inventory"
                    components={{ code: <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded" /> }}
                  />
                </span>
              </li>
            </ol>
          </section>

          <section className="flex flex-col gap-3 w-full overflow-hidden">
            <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={fileChangeHandler} />

            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors w-full overflow-hidden",
                file ? "border-primary bg-primary/5" : "border-dashed",
              )}
            >
              <FileJsonIcon className="size-5 shrink-0 text-muted-foreground" />
              <span className={cn("flex-1 text-sm truncate font-mono", !file && "text-muted-foreground/50")}>
                {file ? file.name : t("uploadInventory.button_upload_file_placeholder")}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isPending}>
                {t("uploadInventory.button_upload_file")}
              </Button>
            </div>

            {isError && (
              <div className="flex items-start gap-2 text-destructive">
                <AlertCircleIcon className="size-4 mt-0.5 shrink-0" />
                <p className="text-sm">{t("uploadInventory.error_upload")}</p>
              </div>
            )}

            <Button
              onClick={uploadHandler}
              disabled={!file || isPending || isSuccess}
              className={cn(isSuccess && "bg-green-600 hover:bg-green-600 text-white")}
            >
              {isPending && <Spinner />}
              {isSuccess ? (
                <>
                  <CheckIcon />
                  {t("uploadInventory.button_success")}
                </>
              ) : (
                <>
                  <UploadIcon />
                  {t("uploadInventory.button_upload")}
                </>
              )}
            </Button>
          </section>

          <section className="flex flex-col gap-1.5">
            <h4 className="text-sm font-medium">{t("uploadInventory.notes_title")}</h4>
            <ul className="flex flex-col gap-1 list-disc pl-4">
              <li className="text-sm text-muted-foreground">{t("uploadInventory.notes_manual")}</li>
              <li className="text-sm text-muted-foreground">{t("uploadInventory.notes_safety")}</li>
            </ul>
          </section>

          <section className="flex flex-col gap-1.5">
            <h4 className="text-sm font-medium">{t("uploadInventory.help_title")}</h4>
            <p className="text-sm text-muted-foreground">{t("uploadInventory.help_description")}</p>
            <ul className="flex flex-col gap-1 list-disc pl-4">
              <li className="text-sm text-muted-foreground">
                <Trans
                  i18nKey="uploadInventory.help_link_form"
                  ns="inventory"
                  components={[
                    <a
                      key="0"
                      href={FEEDBACK_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-foreground transition-colors"
                    />,
                  ]}
                />
              </li>
              <li className="text-sm text-muted-foreground">
                <Trans
                  i18nKey="uploadInventory.help_link_direct"
                  ns="inventory"
                  components={[
                    <a
                      key="0"
                      href={DIRECT_MESSAGE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-foreground transition-colors"
                    />,
                  ]}
                />
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">{t("uploadInventory.help_extra")}</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadInventory;
