"use client";

import * as z from "zod";
import { useCallback, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import CardWrapper from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";


const LoginForm = () => {
  const { t, i18n } = useTranslation(['login', 'common']);
  const currentLocale = i18n.language;

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
  ? t('common:email_in_use')
  : "";
  
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  
  
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: useMemo(() => ({
      email: "",
      password: "",
    }), []),
  });

  const router = useRouter();

  const onSubmit = useCallback((values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, currentLocale, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(t('login:subheading'));
            setIsRedirecting(true);
            router.push(data?.redirectTo as string);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
          .catch(() => setError(t('common:wrong')));
    });
  }, [currentLocale, callbackUrl, t, form, router]);

  return (
    <div className="relative">
      <CardWrapper
        headerLabel={t('login:subheading')}
        backButtonLabel={t('login:no_account')}
        backButtonHref="/auth/register"
        showSocial
      >
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common:2FCode')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        disabled={isPending} 
                        placeholder="123456"
                        autoComplete="one-time-code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />            
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('login:email')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPending} 
                          placeholder="john.doe@example.com"
                          autoComplete="username"
                          type="email" />
                      </FormControl>
                      <FormMessage className="mt-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('login:password')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          disabled={isPending} 
                          placeholder="******"
                          autoComplete="current-password"
                          type="password" />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                        >
                        <Link href="/auth/reset">
                          {t('login:forgot_password')}
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending || isRedirecting}
              type="submit"
              className="w-full"
            >
              {showTwoFactor ? t('common:confirm') : t('login:login')}
            </Button>
          </form>
        </Form>
      </CardWrapper>
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-50 w-50 animate-spin text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
