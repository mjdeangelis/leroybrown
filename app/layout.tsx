import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/app/lib/utils";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const metadata: Metadata = {
  title: "Leroy Brown Invitational",
  description: "For the pups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className='mx-auto max-w-screen-lg p-4'>{children}</div>
      </body>
    </html>
  );
}
