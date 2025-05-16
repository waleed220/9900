"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, ShoppingCart, DollarSign, TrendingUp, Package, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAdmin } from "@/context/admin-context"
import { useProducts } from "@/context/product-context"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isLoggedIn } = useAdmin()
  const { products } = useProducts()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/admin/login")
    } else {
      setIsLoading(false)
    }
  }, [isLoggedIn, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Mock data for dashboard
  const stats = [
    {
      title: "إجمالي المبيعات",
      value: "$1,254",
      change: "+12%",
      isPositive: true,
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "المستخدمين",
      value: "1,250",
      change: "+8%",
      isPositive: true,
      icon: <Users className="h-6 w-6" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "الطلبات",
      value: "45",
      change: "+15%",
      isPositive: true,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "معدل التحويل",
      value: "3.2%",
      change: "-0.5%",
      isPositive: false,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
  ]

  const recentOrders = [
    { id: "#12345", user: "أحمد محمد", product: "تفعيل", amount: "$14", status: "مكتمل", date: "2024-05-15" },
    { id: "#12344", user: "محمد علي", product: "مقابلة فورية", amount: "$30", status: "مكتمل", date: "2024-05-14" },
    {
      id: "#12343",
      user: "سارة أحمد",
      product: "أولوية الدخول",
      amount: "$30",
      status: "قيد المعالجة",
      date: "2024-05-14",
    },
    { id: "#12342", user: "خالد محمود", product: "تفعيل", amount: "$14", status: "مكتمل", date: "2024-05-13" },
    {
      id: "#12341",
      user: "فاطمة علي",
      product: "مقابلة فورية",
      amount: "$30",
      status: "قيد المعالجة",
      date: "2024-05-13",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
        <div className="text-sm text-gray-400">آخر تحديث: {new Date().toLocaleDateString("ar-SA")}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="flex items-center mb-4">
              <div className={`${stat.color} p-3 rounded-lg ml-4 shadow-lg`}>{stat.icon}</div>
              <div>
                <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
            <div className={`text-sm ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
              {stat.change} منذ الشهر الماضي
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg shadow-lg lg:col-span-2 border border-gray-700"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-orange-500 hover:text-orange-400 transition-colors">
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-gray-400 text-sm">
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">المستخدم</th>
                  <th className="p-4">المنتج</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">{order.user}</td>
                    <td className="p-4">{order.product}</td>
                    <td className="p-4">{order.amount}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "مكتمل" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status === "مكتمل" ? (
                          <CheckCircle className="ml-1 h-3 w-3" />
                        ) : (
                          <Clock className="ml-1 h-3 w-3" />
                        )}
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Active Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-lg border border-gray-700"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">المنتجات النشطة</h2>
            <Link href="/admin/products" className="text-orange-500 hover:text-orange-400 transition-colors">
              إدارة المنتجات
            </Link>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {products.slice(0, 5).map((product, index) => (
                <li key={product.id} className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <div
                    className={`bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg ml-4 shadow-md flex items-center justify-center`}
                  >
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{product.name}</h3>
                    <p className="text-gray-400">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <CheckCircle className="ml-1 h-3 w-3" />
                      {product.inStock ? "متوفر" : "غير متوفر"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
