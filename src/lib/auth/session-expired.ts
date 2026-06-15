/**
 * Oturum süresi dolduğunda tek seferlik çıkış + login yönlendirmesi.
 * Paralel 401'lerin sonsuz signOut/getSession döngüsüne girmesini önler.
 */

let isHandling = false;

export async function handleSessionExpired(): Promise<void> {
    if (typeof window === "undefined" || isHandling) return;
    isHandling = true;

    try {
        const { signOut } = await import("next-auth/react");
        await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
        console.error("[handleSessionExpired]", error);
        window.location.href = "/auth/login";
    }
}
