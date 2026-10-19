import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "PeduC — Your learning workspace",
    template: "%s | PeduC",
  },
  description:
    "A serious learning workspace connecting familiar interests to formal concepts, independent practice, and transfer.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
