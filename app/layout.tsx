import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Interview",
  description: "AI For Interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        {children}
        <Toaster></Toaster>
      </body>
    </html>
  );
}
