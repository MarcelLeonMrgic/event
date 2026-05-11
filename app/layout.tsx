import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Events | TuDo Makerspace",
  description: "Events für den TuDo makerspace an der TUBerlin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
