import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/features/iam/components/login-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Giriş Yap | Gold ERP",
    description: "ERP Sistemine Giriş",
};

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-4 p-6 md:p-10">
                <Card className="w-full max-w-md">
                    <CardContent className="w-full flex flex-col gap-gutter">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <Link href="/" className="inline-block">
                                <Image
                                    src="/brand-logo.png"
                                    alt="Gold ERP Logo"
                                    width={256}
                                    height={256}
                                    className="h-20 w-auto object-contain md:h-28"
                                    priority
                                />
                            </Link>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Portal Girişi
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    B2B portal hesabınızla giriş yapın.
                                </p>
                            </div>
                        </div>
                        <LoginForm />
                    </CardContent>
                </Card>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/auth-background.jpg"
                    alt="Image"
                    width={1000}
                    height={1000}
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    priority
                />
            </div>
        </div>
    );
}