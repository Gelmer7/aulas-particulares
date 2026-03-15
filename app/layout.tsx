import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PrimeProvider } from "@/components/layout/prime-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professora de Exatas | Aulas Particulares de Química e Física",
  description: "Mentoria de alta performance em Química e Física para Ensino Médio e Vestibulares. Agende sua aula particular online ou presencial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrimeProvider>
          {children}
        </PrimeProvider>
      </body>
    </html>
  );
}
