import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AKBEN B2B Portal",
    description: "AKBEN Kuyumculuk B2B Müşteri Portalı",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <Providers>
                    <NextTopLoader />
                    <Toaster
                        position="top-center"
                        containerAriaLabel="Toaster"
                        richColors
                        closeButton
                        style={{ zIndex: 9999 }}
                    />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
