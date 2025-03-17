import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";

import ManagerSideBar from "@/components/sidebar/ManagerSideBar";
import { AuthenticatorProvider } from "@/contexts/AuthenticatorContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Play2Learn",
  description: "",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthenticatorProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
              <ManagerSideBar>
                {children}
              </ManagerSideBar>
            </div>
          </AuthProvider>
        </AuthenticatorProvider>
      </body>
    </html>
  );
}
