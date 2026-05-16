import type { VariantProps } from "class-variance-authority";
import { CloudUploadIcon, FileCheckCornerIcon, XIcon } from "lucide-react";
import {
  useRef,
  type ChangeEvent,
  type FC,
  type FunctionComponent,
  type InputHTMLAttributes,
  type MouseEvent,
  type SVGProps,
} from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/cn";

import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface InputFileProps {
  id: string;
  file?: File;
  onChange: (file?: File) => void;
  onClear?: () => void;
  fileIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  className?: string;
  accept?: InputHTMLAttributes<HTMLInputElement>["accept"];
  variant?: VariantProps<typeof buttonVariants>['variant'];
  disabled?: boolean;
  placeholder?: string;
}

const InputFile: FC<InputFileProps> = ({
  id,
  file,
  onChange,
  onClear,
  fileIcon: FileIcon,
  className,
  accept,
  variant = 'secondary',
  disabled,
  placeholder,
}) => {
  const { t } = useTranslation();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    onChange(file);
  };

  const clearHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }

    onClear?.();
  };

  const FileIconComponent = FileIcon ?? FileCheckCornerIcon;

  return (
    <>
      <Button
        asChild
        variant={variant}
        className={cn("grow justify-start pl-3! pr-0! overflow-hidden shrink", className)}
        disabled={disabled}
      >
        <Label htmlFor={id} aria-disabled={disabled}>
          {file ? (
            <>
              <FileIconComponent className="size-4" />
              <span className="truncate">{file.name}</span>
              <Button size="icon-sm" variant="ghost" className="ml-auto bg-transparent!" onClick={clearHandler}>
                <XIcon />
              </Button>
            </>
          ) : (
            <>
              <CloudUploadIcon className="size-4" />
              {placeholder ?? t("uploadInventory.button_upload_file")}
            </>
          )}
        </Label>
      </Button>
      <Input id={id} type="file" ref={inputFileRef} accept={accept} hidden onChange={changeHandler} />
    </>
  );
};

export default InputFile;
