"use client";
import { Button } from "@/components/ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDictionary } from "@/shared/providers/DictionaryProvider";
import { AuthFormContainer, AuthFormTextInput, AuthFormWrapper } from "@/widgets/AuthForm";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, useApi } from "@/hooks/useApi";
import { useUser } from '@/shared/providers/UserProvider';

interface SignInFormInput {
  email: string;
  password: string;
}

const SignInPage = () => {
  const t = useDictionary();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const router = useRouter();
  const { refetch: refetchUser } = useUser();

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInput>();

  const { execute, loading, error } = useApi((body: SignInFormInput) =>
    api<{ access: string }>("/api/auth/signin", {
      method: "POST",
      json: body,
    }),
  );

  const submitHandler: SubmitHandler<SignInFormInput> = async (body) => {
    const { data, error } = await execute(body);

    if (!error) {
      const redirect = searchParams.get("redirect") ?? "/";
      await refetchUser();
      router.push(redirect);
    }
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
        title={t.auth.signin_title}
        submitText={t.auth.submit_signin}
        onSubmit={handleSubmit(submitHandler)}
        loading={loading}
        extra={
          <>
            {t.auth.signin_extra}{" "}
            <Button variant="link" className="p-0 px-1 h-fit text-base" asChild>
              <Link href={`/auth/signup${query ? `?${query}` : ""}`}>{t.auth.signup_link}</Link>
            </Button>
          </>
        }
      >
        <AuthFormTextInput
          id="email"
          leftIcon={<MailIcon />}
          placeholder={t.auth.email_placeholder}
          type="email"
          aria-invalid={errors.email ? "true" : "false"}
          description={errors.email?.message}
          disabled={loading}
          {...register("email", {
            required: t.auth.field_required,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: t.auth.email_invalid,
            },
          })}
        />
        <AuthFormTextInput
          id="password"
          leftIcon={<LockIcon />}
          rightIcon={<PasswordIcon className="cursor-pointer" onClick={togglePasswordVisibilityHandler} />}
          placeholder={t.auth.password_placeholder}
          type={isPasswordVisible ? "text" : "password"}
          aria-invalid={errors.password ? "true" : "false"}
          description={errors.password?.message}
          disabled={loading}
          {...register("password", {
            required: t.auth.field_required,
            minLength: { message: t.auth.field_minlength + "6", value: 6 },
          })}
        />
      </AuthFormContainer>
    </AuthFormWrapper>
  );
};

export default SignInPage;
