"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { LoginFormDTO } from "../schemas/auth.schemas";

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginFormDTO) => {
            const loadingToast = toast.loading("Giriş yapılıyor...", {
                description: "Lütfen bekleyiniz...",
            });

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                toast.dismiss(loadingToast);

                if (!result.success) {
                    throw new Error(result.message);
                }

                return result;
            } catch (error) {
                toast.dismiss(loadingToast);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Giriş başarılı", {
                description: "Sisteme başarıyla giriş yapıldı.",
            });
            setTimeout(() => {
                window.location.reload();
            }, 500);
        },
        onError: (error) => {
            const message = (error as Error).message;
            toast.error("Giriş başarısız", {
                description: message || "Lütfen bilgilerinizi kontrol edin.",
            });
        },
    });
};
