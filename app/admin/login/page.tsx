"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, User, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAdmin } from "@/context/admin-context"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAdmin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Attempt login
    const success = login(username, password)

    if (success) {
      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-700"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo.png"
              alt="Perfect Logo"
              width={100}
              height={100}
              className="mx-auto mb-4 rounded-full border-2 border-orange-500 p-1"
            />
          </Link>
          <h1 className="text-2xl font-bold text-white">تسجيل دخول المشرف</h1>
          <p className="text-gray-400 mt-2">الرجاء إدخال بيانات الدخول للوصول إلى لوحة التحكم</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-md flex items-center mb-6"
          >
            <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-300 mb-2">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="أدخل اسم المستخدم"
                required
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="أدخل كلمة المرور"
                required
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md font-bold transition-all ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/20"
            }`}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-orange-500 hover:text-orange-400 transition-colors">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
