"use client";

import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { InputWithInsetLabel } from "@/components/ui/input";
import { loginSchema, type LoginFormDTO } from "../schemas/auth.schemas";
import { useLogin } from "../api/use-login";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

export function LoginForm() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const form = useForm<LoginFormDTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userNameOrEmail: "",
            password: "",
        },
        mode: "onBlur",
    });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = async (data: FieldValues) => {
        login(data as LoginFormDTO);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-base">
                <TooltipProvider>
                    <FormField
                        control={form.control}
                        name="userNameOrEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputWithInsetLabel
                                        id="userNameOrEmail"
                                        label="E-posta veya Kullanıcı Adı"
                                        isRequired
                                        inputMode="email"
                                        placeholder="E-posta veya kullanıcı adınız"
                                        autoComplete="off"
                                        disabled={isPending}
                                        tabIndex={1}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputWithInsetLabel
                                        id="password"
                                        label="Şifre"
                                        autoComplete="off"
                                        isRequired
                                        type={isPasswordVisible ? "text" : "password"}
                                        title={isPasswordVisible ? 'Gizle' : 'Göster'}
                                        inputMode="text"
                                        placeholder="Şifrenizi giriniz"
                                        disabled={isPending}
                                        tabIndex={2}
                                        trailing={
                                            <Button
                                                variant='ghost'
                                                type="button"
                                                title={isPasswordVisible ? 'Gizle' : 'Göster'}
                                                size='icon'
                                                onClick={() => setIsPasswordVisible(prevState => !prevState)}
                                                className='justify-center items-center text-muted-foreground focus-visible:ring-ring/50 rounded-full hover:bg-transparent'
                                            >
                                                {isPasswordVisible ? (
                                                    <EyeOffIcon />
                                                ) : (
                                                    <EyeIcon />
                                                )}
                                                <span className='sr-only'>{isPasswordVisible ? 'Gizle' : 'Göster'}</span>
                                            </Button>
                                        }
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TooltipProvider>
                <div className="flex items-center justify-end">
                    <Link
                        href="/auth/forgot-password"
                        className="text-xs font-medium text-primary hover:underline"
                        tabIndex={3}
                    >
                        Şifremi Unuttum
                    </Link>
                </div>

                <Button tabIndex={3} type="submit" className="mt-2 h-12 w-full" size="lg" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Giriş yapılıyor...
                        </>
                    ) : (
                        'Giriş Yap'
                    )}
                </Button>
            </form>
        </Form>
    );
}
