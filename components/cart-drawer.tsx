"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import Link from "next/link"

export default function CartDrawer() {
  const { items, totalPrice, totalItems, removeItem, updateQuantity, isCartOpen, setIsCartOpen } = useCart()

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            className="fixed left-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ShoppingCart className="ml-2 h-5 w-5 text-orange-500" />
                سلة التسوق ({totalItems})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">سلة التسوق فارغة</h3>
                <p className="text-gray-400 mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-6 rounded-md transition-all shadow-lg hover:shadow-orange-500/20"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-700 rounded-lg overflow-hidden flex shadow-md"
                      >
                        <div className="w-20 h-20 relative flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 p-3 flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-orange-500 font-bold mt-1">${item.price.toFixed(2)}</div>
                          <div className="flex items-center mt-auto">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-gray-700 p-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400">المجموع:</span>
                    <span className="font-bold text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-full flex items-center justify-center py-3 rounded-md transition-all shadow-lg hover:shadow-orange-500/20"
                    onClick={() => setIsCartOpen(false)}
                  >
                    إتمام الشراء
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
