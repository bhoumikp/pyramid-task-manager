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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var accent = localStorage.getItem('accent');
                  if (accent) {
                    document.documentElement.dataset.accent = accent;
                  } else {
                    document.documentElement.dataset.accent = 'black';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
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
