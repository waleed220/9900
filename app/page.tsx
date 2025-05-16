"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function HomePage() {
  const { addItem } = useCart()
  const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const products = [
    {
      id: "activation",
      name: "تفعيل",
      description: "تفعيل حسابك في السيرفر والحصول على مميزات حصرية",
      price: 14.0,
      image: "/images/activation.png",
      href: "/products/activation",
    },
    {
      id: "priority-entry",
      name: "أولوية الدخول السريع",
      description: "احصل على أولوية دخول للسيرفر وتخطي قوائم الانتظار",
      price: 30.0,
      image: "/images/priority-entry.png",
      href: "/products/priority-entry",
    },
    {
      id: "interview",
      name: "مقابلة فورية",
      description: "احصل على مقابلة فورية مع إدارة السيرفر عبر ديسكورد",
      price: 30.0,
      image: "/images/interview.png",
      href: "/products/interview",
    },
  ]

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    setAddedProducts((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedProducts((prev) => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="hero bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 mb-12 border border-gray-800 shadow-xl"
      >
        <div className="flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            مرحباً بك في متجر <span className="text-orange-500">Perfect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-300 mb-8 max-w-2xl text-lg"
          >
            المتجر الرسمي لسيرفر فايف ام رول بلاي - احصل على أفضل العروض والمميزات الحصرية
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 sm:space-x-reverse"
          >
            <Link href="/products" className="btn-orange px-8 py-3 text-lg font-bold">
              تصفح المنتجات
            </Link>
            <Link
              href="/discord"
              className="bg-gray-800 text-white px-8 py-3 rounded-md hover:text-orange-500 transition-colors text-lg font-bold border border-gray-700"
            >
              انضم للديسكورد
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-white text-center"
      >
        منتجاتنا المميزة
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate={isVisible ? "show" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={item}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-700"
          >
            <Link href={product.href} className="block relative h-56 overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </Link>
            <div className="p-6">
              <Link href={product.href}>
                <h3 className="text-xl font-bold text-white mb-3 hover:text-orange-500 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-300 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`inline-flex items-center px-4 py-2 rounded-md transition-all ${
                    addedProducts[product.id]
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {addedProducts[product.id] ? (
                    <>
                      <Check className="ml-2 h-4 w-4" />
                      <span>تمت الإضافة</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="ml-2 h-4 w-4" />
                      <span>أضف للسلة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-gray-700 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-white text-center">انضم إلى مجتمعنا</h2>
        <p className="text-gray-300 mb-6 text-center max-w-2xl mx-auto">
          انضم إلى مجتمعنا النشط على Discord للتواصل مع المستخدمين الآخرين والحصول على المساعدة والدعم الفوري.
        </p>
        <div className="flex justify-center">
          <Link href="/discord" className="btn-orange inline-flex items-center px-8 py-3 text-lg font-bold">
            <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
            </svg>
            انضم الآن
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
