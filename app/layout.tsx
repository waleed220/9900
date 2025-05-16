import type React from "react"
import "@/styles/globals.css"
import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import Sidebar from "@/components/sidebar"
import CartDrawer from "@/components/cart-drawer"
import { CartProvider } from "@/context/cart-context"
import { ProductProvider } from "@/context/product-context"
import { AdminProvider } from "@/context/admin-context"

// Load Tajawal font with next/font/google
const tajawal = Tajawal({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
})

export const metadata: Metadata = {
  title: "Perfect - متجر سيرفر فايف ام",
  description: "المتجر الرسمي لسيرفر فايف ام رول بلاي - احصل على أفضل العروض والمميزات الحصرية",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <AdminProvider>
          <ProductProvider>
            <CartProvider>
              <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar />
                <main className="flex-1 overflow-auto">{children}</main>
                <CartDrawer />
              </div>
            </CartProvider>
          </ProductProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
