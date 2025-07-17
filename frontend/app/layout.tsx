
import "./globals.css";


import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OF',
  description: 'Next.js social media application project',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
  
}>) {
  return (
    <html lang="en">
      <body>
        <div className="">
          {children}
        </div>
      </body>
    </html>
  );
}