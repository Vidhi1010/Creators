'use client';

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-black">
        {children}
      </body>
    </html>
  );
}