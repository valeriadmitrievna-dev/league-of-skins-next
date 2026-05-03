import { FC, PropsWithChildren, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import AuthFormTitle from "./AuthFormTitle";
import LanguageSwitcher from "../LanguageSwitcher";

interface AuthFormContainerProps extends PropsWithChildren {
  title?: string;
  submitText?: string;
  onSubmit?: () => void;
  extra?: ReactNode;
  loading?: boolean;
}

const AuthFormContainer: FC<AuthFormContainerProps> = ({ title, children, submitText, onSubmit, loading, extra }) => {
  // TODO: проверить разметку (классы)
  return (
    <Card className="px-5 py-6 max-w-full w-100 relative">
      <div className="flex items-center justify-end gap-2">
        {!!title && <AuthFormTitle className="mr-auto">{title}</AuthFormTitle>}
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col gap-y-4">{children}</div>
      <div className="p-0 flex items-center gap-3">
        <Button type="submit" size="lg" onClick={onSubmit} disabled={loading}>
          {loading && <Spinner data-icon="inline-start" />}
          {submitText}
        </Button>
      </div>
      {!!extra && <p className="text-muted-foreground">{extra}</p>}
    </Card>
  );
};

export default AuthFormContainer;
