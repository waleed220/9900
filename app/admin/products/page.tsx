"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  StarOff,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useProducts, type Product } from "@/context/product-context"

export default function AdminProducts() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { products, updateProduct, deleteProduct } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

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

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.includes(searchQuery) ||
      product.description.includes(searchQuery) ||
      product.category.includes(searchQuery),
  )

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const toggleFeatured = (product: Product) => {
    updateProduct(product.id, { featured: !product.featured })
  }

  const toggleStock = (product: Product) => {
    updateProduct(product.id, { inStock: !product.inStock })
  }

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteProduct(id)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">إدارة المنتجات</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <Link
            href="/admin/products/add"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-md transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center whitespace-nowrap"
          >
            <Plus className="ml-2 h-5 w-5" />
            <span>إضافة منتج</span>
          </Link>
        </div>
      </div>

      {currentProducts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">لا توجد منتجات</h2>
          <p className="text-gray-400 mb-6">
            {searchQuery ? "لم نتمكن من العثور على أي منتجات تطابق بحثك" : "لم تقم بإضافة أي منتجات بعد"}
          </p>
          <Link
            href="/admin/products/add"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-6 rounded-md transition-all shadow-lg hover:shadow-orange-500/20 inline-flex items-center"
          >
            <Plus className="ml-2 h-5 w-5" />
            <span>إضافة منتج جديد</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-right">
                    <th className="p-4">المنتج</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4">التصنيف</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">مميز</th>
                    <th className="p-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 relative rounded-md overflow-hidden ml-3">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{product.name}</h3>
                            <p className="text-gray-400 text-sm truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 text-sm line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-white">
                          <Tag className="ml-1 h-3 w-3" />
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleStock(product)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.inStock ? (
                            <>
                              <CheckCircle className="ml-1 h-3 w-3" />
                              متوفر
                            </>
                          ) : (
                            <>
                              <XCircle className="ml-1 h-3 w-3" />
                              غير متوفر
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleFeatured(product)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.featured ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.featured ? (
                            <>
                              <Star className="ml-1 h-3 w-3" />
                              مميز
                            </>
                          ) : (
                            <>
                              <StarOff className="ml-1 h-3 w-3" />
                              غير مميز
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-md ${
                      currentPage === page ? "bg-orange-500 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
