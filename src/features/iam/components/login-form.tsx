"use client";

import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormDTO } from "../schemas/auth.schemas";
import { useLogin } from "../api/use-login";

export function LoginForm() {
    const form = useForm<LoginFormDTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userNameOrEmail: "test_portal",
            password: "Portal123!",
        },
        mode: "onBlur",
    });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = async (data: FieldValues) => {
        login(data as LoginFormDTO);
    };

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="userNameOrEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eposta veya Kullanıcı Adı</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        inputMode="email"
                                        placeholder="Eposta veya Kullanıcı Adı"
                                        autoComplete="off"
                                        autoSave="off"
                                        disabled={isPending}
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
                                <FormLabel>Şifre</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        inputMode="text"
                                        placeholder="••••••••"
                                        autoComplete="off"
                                        autoSave="off"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <LogIn className="mr-2 h-4 w-4" />
                        )}
                        Giriş Yap
                    </Button>
                </form>
            </Form>
        </div>
    );
}
