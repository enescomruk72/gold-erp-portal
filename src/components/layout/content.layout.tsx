export default function AppContentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="w-full min-w-0">{children}</div>;
}
