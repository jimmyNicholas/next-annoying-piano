import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annoying Piano",
  description: "A web based piano that changes pitch as you play it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
