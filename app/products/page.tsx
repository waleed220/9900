"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Search, Check } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useProducts } from "@/context/product-context"

export default function ProductsPage() {
  const { addItem } = useCart()
  const { products } = useProducts()
  const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.includes(searchQuery) ||
      product.description.includes(searchQuery) ||
      product.category.includes(searchQuery),
  )

  const handleAddToCart = (product: (typeof products)[0]) => {
    if (!product.inStock) return

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
      >
        <h1 className="text-3xl font-bold text-white">منتجاتنا</h1>

        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg overflow-hidden"
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-auto"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-2">{product.name}</h2>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <p className="text-lg font-bold text-orange-500 mb-4">{product.price} EGP</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="flex items-center justify-center bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600"
              >
                {addedProducts[product.id] ? (
                  <Check className="w-5 h-5 mr-2" />
                ) : (
                  <ShoppingCart className="w-5 h-5 mr-2" />
                )}
                {addedProducts[product.id] ? "تم إضافة المنتج" : "أضف إلى السلة"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
