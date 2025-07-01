import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/auth-provider"; // <-- Import it

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MenoWellness",
  description: "Your personal wellness companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider> {/* <-- Wrap children */}
      </body>
    </html>
  );
}
