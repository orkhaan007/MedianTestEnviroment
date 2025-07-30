import { Geist } from "next/font/google";
import "./globals.scss";
import ScrollToTop from "@/components/ui/ScrollToTop";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Median",
  description: "The best",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
