import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartContext";
import Header from "./Header";
import Footer from "./Footer";
import FloatingCart from "./FloatingCart";
import { getCurrentUser } from "./lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mobile and Accessories",
  description:
    "Original mobile accessories at honest prices, delivered across Pakistan.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50">
        {/* CartProvider shares one cart with every page inside it.
            Header shows on every page; children is the current page. */}
        <CartProvider>
          <Header user={user} />
          {children}
          <Footer />
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}
