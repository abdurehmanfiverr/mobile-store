import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartContext";
import Header from "./Header";
import Footer from "./Footer";
import FloatingCart from "./FloatingCart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shehroz Mobiles and Accessories",
  description:
    "Original mobile accessories at honest prices, delivered across Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50">
        {/* CartProvider shares one cart with every page inside it.
            Header shows on every page; children is the current page. */}
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}
