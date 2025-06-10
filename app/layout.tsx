import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DataProvider } from '@/lib/data-context';
import ReactQueryProvider from '@/components/providers/react-query-provider';

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DesignFlow Pro - Project Management & Financial Control",
  description: "Swiss-minimal SaaS platform for graphic design project management with integrated financial control. Clean, professional, and efficient.",
  keywords: ["project management", "design", "financial control", "SaaS", "Swiss design"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}