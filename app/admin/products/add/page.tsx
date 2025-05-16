"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, ImageIcon, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/context/product-context"

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { addProduct } = useProducts()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    image: "/placeholder.svg?height=400&width=400",
    category: "activation",
    features: [""],
    inStock: true,
    featured: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")

    if (adminLoggedIn !== "true") {
      router.push("/admin/login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Filter out empty features
      const filteredFeatures = formData.features.filter((feature) => feature.trim() !== "")

      addProduct({
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        price: Number.parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        features: filteredFeatures,
        inStock: formData.inStock,
        featured: formData.featured,
      })

      // Redirect to products page
      router.push("/admin/products")
    } catch (error) {
      console.error("Error adding product:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="flex items-center text-gray-300 hover:text-orange-500 transition-colors"
        >
          <ArrowRight className="ml-2 h-5 w-5" />
          <span>العودة إلى المنتجات</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6"
      >
        <h1 className="text-2xl font-bold text-white mb-6">إضافة منتج جديد</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  اسم المنتج <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-300 mb-2">
                  وصف مختصر <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-gray-300 mb-2">
                  السعر <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-8 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block text-gray-300 mb-2">
                  رابط الصورة
                </label>
                <div className="relative">
                  <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  أدخل رابط الصورة أو اترك الحقل فارغًا لاستخدام صورة افتراضية
                </p>
              </div>

              <div>
                <label htmlFor="category" className="block text-gray-300 mb-2">
                  التصنيف <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="activation">التفعيل</option>
                  <option value="priority">أولوية الدخول</option>
                  <option value="interview">مقابلة فورية</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div className="flex items-center space-x-6 space-x-reverse">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="inStock" className="mr-2 text-gray-300">
                    متوفر في المخزون
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="featured" className="mr-2 text-gray-300">
                    منتج مميز
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="longDescription" className="block text-gray-300 mb-2">
                  وصف تفصيلي <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300">المميزات</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-orange-500 hover:text-orange-400 transition-colors flex items-center text-sm"
                  >
                    <Plus className="ml-1 h-4 w-4" />
                    إضافة ميزة
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="أدخل ميزة المنتج"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="mr-2 text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/admin/products"
              className="bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors ml-4"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-6 rounded-md transition-all shadow-lg hover:shadow-orange-500/20 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
