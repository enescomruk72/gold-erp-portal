"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { LoginFormDTO } from "../schemas/auth.schemas";

export interface LoginApiResponse {
    success: boolean;
    message?: string;
    error?: string;
}

async function loginRequest(
    data: LoginFormDTO
): Promise<LoginApiResponse> {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
        const err = new Error(json.message ?? "Giriş başarısız") as Error & {
            statusCode?: number;
        };
        err.statusCode = res.status;
        throw err;
    }

    return json;
}

export function useLoginMutation() {
    const router = useRouter();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: () => {
            router.refresh();
            router.push("/");
        },
    });
}
