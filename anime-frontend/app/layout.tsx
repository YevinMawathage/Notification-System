import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming you have the default Inter font
import "./globals.css";

// 1. Import your new Navbar
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anime Notification System",
  description: "Get alerts for your favorite currently airing anime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        {/* 2. Place the Navbar at the very top of the body! */}
        <Navbar />
        
        {/* 3. The current page content renders inside here */}
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}