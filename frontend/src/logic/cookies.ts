export function setCookie(name: string, value: string, expiryDays: number) {
    const date = new Date();
    date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    const cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
    document.cookie = cookie;
}

export function getCookie(name: string): string | null {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (!cookie.startsWith(name + "=")) {
            continue;
        }

        return cookie.substring(`${name}=`.length, cookie.length);
    }
    return null;
}
