import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

export const metadata: Metadata = {
  title: "BioLearn - Learn Bioinformatics the CS Way",
  description: "Free premium online courses for computer scientists transitioning to computational biology. DNA as code, cells as operating systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
