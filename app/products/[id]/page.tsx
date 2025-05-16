"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, ArrowRight, Check } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useProducts } from "@/context/product-context"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addItem } = useCart()
  const { getProduct } = useProducts()
  const [isAdded, setIsAdded] = useState(false)

  const product = getProduct(params.id)

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">المنتج غير موجود</h1>
        <Link href="/products" className="btn-orange inline-flex items-center">
          <ArrowRight className="ml-2 h-5 w-5" />
          <span>العودة إلى المنتجات</span>
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-6">
        <Link href="/products" className="flex items-center text-gray-300 hover:text-orange-500 transition-colors">
          <ArrowRight className="ml-2 h-5 w-5" />
          <span>العودة إلى المنتجات</span>
        </Link>
      </div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-96 md:h-full overflow-hidden">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="p-6">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-3"
            >
              {product.name}
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 mb-4"
            >
              {product.description}
            </motion.p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center mb-6"
            >
              <span className="text-3xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mr-3">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount && (
                <span className="bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded-md mr-3">
                  خصم {product.discount}%
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-3">الوصف</h2>
              <div className="text-gray-300 whitespace-pre-line">{product.longDescription}</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-3">المميزات</h2>
              <ul className="text-gray-300 space-y-2">
                {product.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <span className="text-orange-500 ml-2">•</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className={`w-full flex items-center justify-center py-3 rounded-md transition-all ${
                isAdded ? "bg-green-600 hover:bg-green-700" : "btn-orange"
              }`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {!product.inStock ? (
                "غير متوفر حالياً"
              ) : isAdded ? (
                <>
                  <Check className="ml-2 h-5 w-5" />
                  <span>تمت الإضافة إلى السلة</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="ml-2 h-5 w-5" />
                  <span>أضف إلى السلة</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
