import { NextAuthProvider } from "./next-auth.provider";
import { ThemeProvider } from "./next-theme.provider";
import { NuqsProvider } from "./nuqs.provider";
import { TanstackQueryProvider } from "./tanstack-query.provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthProvider>
            <TanstackQueryProvider state={null}>
                <NuqsProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </NuqsProvider>
            </TanstackQueryProvider>
        </NextAuthProvider>
    );
}
