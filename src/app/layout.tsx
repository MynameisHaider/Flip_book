import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  weight: ["400", "700"],
  variable: "--font-urdu",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "اردو فلیپ بوک | Urdu Flipbook Platform",
  description: "Professional Urdu flipbook reading platform with realistic page-flip animations and elegant Nastaliq font.",
  keywords: ["Urdu", "Flipbook", "Nastaliq", "Reading", "Books", "اُردو"],
  authors: [{ name: "Urdu Flipbook Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "اردو فلیپ بوک | Urdu Flipbook Platform",
    description: "Professional Urdu flipbook reading platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" dir="rtl" suppressHydrationWarning>
      <body
        className={`${notoNastaliqUrdu.variable} antialiased bg-background text-foreground font-urdu`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
