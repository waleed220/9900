"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X, ShoppingCart, User, LogOut, Settings } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAdmin } from "@/context/admin-context"
import { usePathname } from "next/navigation"

type CategoryItem = {
  id: string
  title: string
  icon: React.ReactNode
  subcategories?: {
    id: string
    title: string
    href: string
  }[]
}

export default function Sidebar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()
  const { isLoggedIn, logout } = useAdmin()
  const pathname = usePathname()

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [pathname])

  const categories: CategoryItem[] = [
    {
      id: "main",
      title: "الرئيسية",
      icon: (
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      subcategories: [
        { id: "home", title: "الصفحة الرئيسية", href: "/" },
        { id: "about", title: "من نحن", href: "/about" },
        { id: "contact", title: "اتصل بنا", href: "/contact" },
      ],
    },
    {
      id: "products",
      title: "المنتجات",
      icon: <ShoppingCart className="h-5 w-5" />,
      subcategories: [
        { id: "all-products", title: "جميع المنتجات", href: "/products" },
        { id: "activation", title: "التفعيل", href: "/products/category/activation" },
        { id: "priority", title: "أولوية الدخول السريع", href: "/products/category/priority" },
        { id: "interview", title: "مقابلة فورية", href: "/products/category/interview" },
      ],
    },
    {
      id: "discord",
      title: "ديسكورد",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
        </svg>
      ),
      subcategories: [
        { id: "discord-server", title: "سيرفر الديسكورد", href: "/discord" },
        { id: "support", title: "الدعم الفني", href: "/support" },
      ],
    },
  ]

  // Add admin category if user is admin
  if (isLoggedIn) {
    categories.push({
      id: "admin",
      title: "لوحة التحكم",
      icon: <Settings className="h-5 w-5" />,
      subcategories: [
        { id: "dashboard", title: "الإحصائيات", href: "/admin/dashboard" },
        { id: "products", title: "إدارة المنتجات", href: "/admin/products" },
        { id: "orders", title: "الطلبات", href: "/admin/orders" },
        { id: "users", title: "المستخدمين", href: "/admin/users" },
        { id: "settings", title: "الإعدادات", href: "/admin/settings" },
      ],
    })
  }

  const toggleCategory = (categoryId: string) => {
    if (openCategory === categoryId) {
      setOpenCategory(null)
    } else {
      setOpenCategory(categoryId)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Perfect Logo" width={40} height={40} className="ml-2 rounded-full" />
            <span className="text-xl font-bold text-white">Perfect</span>
          </Link>

          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={() => setIsCartOpen(true)} className="text-white relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <Link href="/login" className="text-white">
              <User className="h-6 w-6" />
            </Link>
            <button onClick={toggleMobileMenu} className="text-white">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop and mobile */}
      <motion.div
        className={`
          sidebar bg-gradient-to-b from-gray-800 to-gray-900 text-white border-l border-gray-700
          fixed md:sticky top-0 right-0 h-full z-40 overflow-y-auto
          md:translate-x-0 md:w-64
          ${isMobileMenuOpen ? "translate-x-0 w-3/4" : "translate-x-full"}
        `}
        animate={{
          x: isMobileMenuOpen || window.innerWidth >= 768 ? 0 : "100%",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
      >
        <div className="sidebar-header p-4 border-b border-gray-700 hidden md:flex items-center justify-center">
          <Link href="/" className="flex flex-col items-center">
            <Image
              src="/images/logo.png"
              alt="Perfect Logo"
              width={80}
              height={80}
              className="rounded-full border-2 border-orange-500 p-1 mb-2"
            />
            <span className="text-xl font-bold text-white">Perfect</span>
          </Link>
        </div>

        <nav className="sidebar-nav p-4">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id} className="category-item">
                <div
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center">
                    <div className="text-orange-500">{category.icon}</div>
                    <span className="mr-2 font-medium">{category.title}</span>
                  </div>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <motion.div
                      animate={{ rotate: openCategory === category.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4 text-orange-500" />
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {category.subcategories && openCategory === category.id && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-1 mr-4 space-y-1 border-r border-orange-500/30 pr-4"
                    >
                      {category.subcategories.map((subcategory) => (
                        <motion.li
                          key={subcategory.id}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Link
                            href={subcategory.href}
                            className={`block p-2 rounded-md transition-colors ${
                              pathname === subcategory.href
                                ? "bg-orange-500/20 text-orange-500 font-medium"
                                : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subcategory.title}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer p-4 border-t border-gray-700">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <LogOut className="ml-2 h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-md transition-colors shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="ml-2 h-4 w-4" />
              <span>تسجيل دخول</span>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>
    </>
  )
}
