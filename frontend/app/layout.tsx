import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AccentProvider } from "@/components/providers/accent-provider";

export const metadata: Metadata = {
  title: "Pyramid",
  description: "A modern task management workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="h-full">
        <ThemeProvider>
          <AccentProvider>
            {children}
          </AccentProvider>  
        </ThemeProvider>
      </body>
    </html>
  );
}
