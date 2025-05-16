"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, User, Lock, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: "777",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")

    if (adminLoggedIn !== "true") {
      router.push("/admin/login")
    } else {
      // Load saved username if it exists
      const savedCredentials = localStorage.getItem("adminCredentials")
      if (savedCredentials) {
        try {
          const { username } = JSON.parse(savedCredentials)
          setFormData((prev) => ({ ...prev, username }))
        } catch (e) {
          console.error("Failed to parse admin credentials from localStorage", e)
        }
      }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    // Validate form
    if (formData.newPassword && formData.newPassword.length < 3) {
      setError("كلمة المرور الجديدة يجب أن تكون على الأقل 3 أحرف")
      setIsSubmitting(false)
      return
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين")
      setIsSubmitting(false)
      return
    }

    // Check current password
    if (formData.newPassword && formData.currentPassword !== "777") {
      const savedCredentials = localStorage.getItem("adminCredentials")
      let currentPasswordValid = false

      if (savedCredentials) {
        try {
          const { password } = JSON.parse(savedCredentials)
          currentPasswordValid = formData.currentPassword === password
        } catch (e) {
          console.error("Failed to parse admin credentials from localStorage", e)
        }
      } else {
        currentPasswordValid = formData.currentPassword === "777"
      }

      if (!currentPasswordValid) {
        setError("كلمة المرور الحالية غير صحيحة")
        setIsSubmitting(false)
        return
      }
    }

    // Save new credentials
    try {
      const newCredentials = {
        username: formData.username,
        password: formData.newPassword ? formData.newPassword : "777",
      }

      localStorage.setItem("adminCredentials", JSON.stringify(newCredentials))

      setSuccess("تم حفظ الإعدادات بنجاح")
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      setError("حدث خطأ أثناء حفظ الإعدادات")
      console.error("Error saving settings:", error)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">إعدادات الحساب</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 relative mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Admin Logo"
                  fill
                  className="rounded-full object-cover border-4 border-orange-500"
                />
              </div>
              <h2 className="text-xl font-bold text-white">حساب المشرف</h2>
              <p className="text-gray-400 mt-1">إدارة إعدادات الحساب</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg"
          >
            <h2 className="text-xl font-bold text-white mb-6">تغيير بيانات الحساب</h2>

            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded-md flex items-center mb-6">
                <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-500 px-4 py-3 rounded-md flex items-center mb-6">
                <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-gray-300 mb-2">
                    اسم المستخدم
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="currentPassword" className="block text-gray-300 mb-2">
                    كلمة المرور الحالية
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-gray-300 mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    اترك هذا الحقل فارغًا إذا كنت لا ترغب في تغيير كلمة المرور
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 pr-10 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-md transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <Save className="ml-2 h-5 w-5" />
                  {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
