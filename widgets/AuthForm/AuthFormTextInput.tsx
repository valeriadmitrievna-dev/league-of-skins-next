import { ComponentProps, FC, ReactNode } from "react";

import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/shared/cn";

interface AuthFormTextInputProps extends Omit<ComponentProps<"input">, "className"> {
  id: string;
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  description?: string;
  onValueChange?: (value: string) => void;
}
const AuthFormTextInput: FC<AuthFormTextInputProps> = ({
  id,
  label,
  leftIcon,
  rightIcon,
  description,
  onChange,
  onValueChange,
  ...props
}) => {
  const changeHandler: AuthFormTextInputProps["onChange"] = (event) => {
    onChange?.(event);
    onValueChange?.(event.target.value ?? "");
  };

  return (
    <Field className="gap-y-2">
      {!!label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <FieldContent>
        <InputGroup
          className={cn("rounded-sm h-10 bg-muted!", {
            "bg-destructive/10!": props["aria-invalid"] === "true",
          })}
        >
          {!!leftIcon && (
            <InputGroupAddon
              className={cn({
                "text-destructive": props["aria-invalid"] === "true",
              })}
            >
              {leftIcon}
            </InputGroupAddon>
          )}
          <InputGroupInput
            id={id}
            className="transition-none aria-invalid:text-destructive aria-invalid:placeholder-destructive/50! bg-muted"
            onChange={changeHandler}
            {...props}
          />
          {!!rightIcon && <InputGroupAddon align="inline-end">{rightIcon}</InputGroupAddon>}
        </InputGroup>
        {!!description && (
          <FieldDescription
            className={cn({
              "text-destructive": props["aria-invalid"] === "true",
            })}
          >
            {description}
          </FieldDescription>
        )}
      </FieldContent>
    </Field>
  );
};

export default AuthFormTextInput;
