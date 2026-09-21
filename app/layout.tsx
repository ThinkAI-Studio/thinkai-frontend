import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { cookies } from "next/headers";
import AiTutorFloatingLauncher from "@/components/ai-tutor/AiTutorFloatingLauncher";
import RouteAccessGuard from "@/components/auth/RouteAccessGuard";
import DevtoolGuard from "@/components/security/DevtoolGuard";
import GlobalBackground from "@/components/visuals/GlobalBackground";

export const metadata: Metadata = {
  title: {
    default: "ThinkAI Lumina — Nền Tảng Học & Luyện Thi Thông Minh",
    template: "%s | ThinkAI Lumina",
  },
  description: "ThinkAI Lumina - Nền tảng học tiếng Anh và luyện thi TOEIC/IELTS thông minh với trợ lý AI BiliBily 24/7.",
  keywords: ["ThinkAI", "ThinkAI Lumina", "Lumina", "TOEIC", "IELTS", "học tiếng Anh", "AI", "gia sư ảo"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme = themeCookie === "light" || themeCookie === "dark" ? themeCookie : "dark";

  return (
    <html lang="vi" data-theme={initialTheme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <GlobalBackground />
        <DevtoolGuard />
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (() => {
              try {
                const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
                localStorage.setItem('theme', theme);
                document.cookie = 'theme=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
              } catch {}
            })();
          `}
        </Script>
        <RouteAccessGuard>{children}</RouteAccessGuard>
        <AiTutorFloatingLauncher />
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
