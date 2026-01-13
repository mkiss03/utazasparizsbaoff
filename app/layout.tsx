import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";

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
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
