import { z } from "zod";

export const loginSchema = z.object({
    userNameOrEmail: z
        .string()
        .min(3, "Kullanıcı adı veya e-posta en az 3 karakter olmalı")
        .max(100),
    password: z
        .string()
        .min(6, "Şifre en az 6 karakter olmalı")
        .max(100, "Şifre en fazla 100 karakter olabilir"),
});

export const nextAuthSchema = z.object({
    id: z.string(),
    userName: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    cari: z.object({
        id: z.string(),
        cariAdi: z.string(),
    }),
    isActive: z.boolean(),
    lastLogin: z.string(),
    roles: z.array(z.string()),
    accessToken: z.string(),
    refreshToken: z.string(),
});

export type LoginFormDTO = z.infer<typeof loginSchema>;
export type NextAuthFormDTO = z.infer<typeof nextAuthSchema>;
