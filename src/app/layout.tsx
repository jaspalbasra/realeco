import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "./theme";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dwello - AI-Enhanced Property Management",
  description: "Modern real estate technology platform with AI-enhanced document processing, commission tracking, and marketplace features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          {children}
          <Toaster position="top-right" />
        </AppThemeProvider>
      </body>
    </html>
  );
}
