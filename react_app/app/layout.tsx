import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Projects and Tickets App",
  description: "A projects and tickets management web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-100">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-100`}
      >
        {children}
      </body>
    </html>
  );
}
