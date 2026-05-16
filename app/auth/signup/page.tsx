"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useT } from "next-i18next/client";
import { MouseEvent, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { errorClientHandler } from "@/errors";
import { fetchClient } from "@/lib/fetchClient";
import { AuthFormContainer, AuthFormTextInput, AuthFormWrapper } from "@/widgets/AuthForm";

interface SignUpFormInput {
  name: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const { t } = useT();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const router = useRouter();

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const { register, handleSubmit, formState } = useForm<SignUpFormInput>();

  const { mutate: signup, isPending: loading } = useMutation({
    mutationFn: (body: SignUpFormInput) => fetchClient("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      const redirect = searchParams.get("redirect") ?? "/";
      router.push(redirect);
      router.refresh();
    },
    onError: errorClientHandler,
  });

  const submitHandler: SubmitHandler<SignUpFormInput> = (body) => {
    signup(body);
  };

  const togglePasswordVisibilityHandler = (event: MouseEvent<SVGElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setPasswordVisible((prev) => !prev);
  };

  const PasswordIcon = isPasswordVisible ? EyeIcon : EyeOffIcon;

  return (
    <AuthFormWrapper>
      <AuthFormContainer
        title={t("auth.signup_title")}
        loading={loading}
        submitText={t("auth.submit_signup")}
        onSubmit={handleSubmit(submitHandler)}
        extra={
          <>
            {t("auth.signup_extra")}{" "}
            <Button variant="link" className="p-0 px-1 h-fit text-base" asChild>
              <Link href={`/auth/signin${query ? `?${query}` : ""}`}>{t("auth.signin_link")}</Link>
            </Button>
          </>
        }
      >
        <AuthFormTextInput
          id="name"
          leftIcon={<UserIcon />}
          placeholder={t("auth.name_placeholder")}
          aria-invalid={formState.errors.name ? "true" : "false"}
          description={formState.errors.name?.message}
          {...register("name", {
            disabled: loading,
            required: t("auth.field_required"),
            minLength: { message: t("auth.field_minlength") + 6, value: 6 },
          })}
        />
        <AuthFormTextInput
          id="email"
          leftIcon={<MailIcon />}
          placeholder={t("auth.email_placeholder")}
          type="email"
          aria-invalid={formState.errors.email ? "true" : "false"}
          description={formState.errors.email?.message}
          {...register("email", {
            disabled: loading,
            required: t("auth.field_required"),
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: t("auth.email_invalid"),
            },
          })}
        />
        <AuthFormTextInput
          id="password"
          leftIcon={<LockIcon />}
          rightIcon={<PasswordIcon role="button" onClick={togglePasswordVisibilityHandler} />}
          placeholder={t("auth.password_placeholder")}
          type={isPasswordVisible ? "text" : "password"}
          aria-invalid={formState.errors.password ? "true" : "false"}
          description={formState.errors.password?.message}
          {...register("password", {
            disabled: loading,
            required: t("auth.field_required"),
            minLength: { message: t("auth.field_minlength") + 6, value: 6 },
          })}
        />
      </AuthFormContainer>
    </AuthFormWrapper>
  );
};

export default SignUpPage;
