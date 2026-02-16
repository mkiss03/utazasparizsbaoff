import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import BoatTourModal from "@/components/BoatTourModal";
import { PostHogProvider } from "@/app/providers/PostHogProvider";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(() => import("@/app/providers/PostHogPageView"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Utazás Párizsba - Párizsi Idegenvezetés",
  description: "Fedezze fel Párizs titkait egy tapasztalt magyar idegenvezetővel. Prémium sétálós túrák a Fények Városában.",
  keywords: "Párizs, idegenvezetés, magyar idegenvezetés, túrák, Franciaország",
  openGraph: {
    title: "Utazás Párizsba - Párizsi Idegenvezetés",
    description: "Fedezze fel Párizs titkait egy tapasztalt magyar idegenvezetővel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-montserrat antialiased">
        <PostHogProvider>
          <PostHogPageView />
          <QueryProvider>
            {children}
          </QueryProvider>
          <BoatTourModal />
        </PostHogProvider>
      </body>
    </html>
  );
}
