import { AuthTopBar } from './auth-top-bar';
import { AuthFooter } from './auth-footer';

type AuthShellProps = {
    children: React.ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
    return (
        <div className="flex min-h-svh flex-col bg-background">
            <AuthTopBar />
            <div className="flex flex-1 flex-col">{children}</div>
            <AuthFooter />
        </div>
    );
}
