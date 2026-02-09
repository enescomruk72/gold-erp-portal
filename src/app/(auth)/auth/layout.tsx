export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="flex min-h-svh w-full">
        <div className="flex w-full">
            <div className="flex-1 min-w-0 h-full flex flex-col">

                {children}
            </div>
        </div>
    </main>;
}