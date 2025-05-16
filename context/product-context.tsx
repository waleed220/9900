"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Product = {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  features: string[]
  category: string
  inStock: boolean
  featured?: boolean
}

type ProductContextType = {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
  applyDiscount: (id: string, discountPercentage: number) => void
  removeDiscount: (id: string) => void
  getFeaturedProducts: () => Product[]
  getProductsByCategory: (category: string) => Product[]
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Initial products data
const initialProducts: Product[] = [
  {
    id: "activation",
    name: "تفعيل",
    description: "تفعيل حسابك في السيرفر والحصول على مميزات حصرية",
    longDescription: `
      رتبة تفعيل في الديسكورد تسمح لك بتعبئة نموذج التفعيل للدخول و الوصول للسيرفر.
      إذا لم تقم بإتمام التفعيل، فإن صلاحية التفعيل هي 30 يوم من تاريخ الشراء.
      
      قبل شراء المنتج يجب عليك التحقق من شروط المنتج:
      • غير مصرح دخول السيرفر لمن هم تحت سن 16 سنة
      • المنتج غير قابل للاسترجاع أو الاستبدال
    `,
    price: 14.0,
    image: "/images/activation.png",
    features: [
      "الوصول الكامل إلى السيرفر",
      "إمكانية إنشاء شخصية",
      "الوصول إلى جميع الميزات الأساسية",
      "دعم فني على مدار الساعة",
    ],
    category: "activation",
    inStock: true,
    featured: true,
  },
  {
    id: "priority-entry",
    name: "أولوية الدخول السريع (24H)",
    description: "احصل على أولوية دخول للسيرفر وتخطي قوائم الانتظار",
    longDescription: `
      ميزة الرتبة وش الفائدة منها:
      
      تعطيك أولوية بالدخول يعني إنك مجرد ماتسوي كونكت للسيرفر و تحصل قدامك 200 شخص ينتظر بالانتظار انت راح تتعداهم جميعهم ويكون لك أولوية بالدخول بحيث إنك ماتنتظر أبداً وتقلل من الانتظار أبداً.
    `,
    price: 30.0,
    image: "/images/priority-entry.png",
    features: [
      "مدة صلاحيتها 24 ساعة من تاريخ تسليم الطلب",
      "نسخة محدودة منها يومياً فقط 10 نسخ",
      "يتم تأثير النسخة هذي كل بداية يوم عند الساعة 3:00 م",
      "لايمكن استرجاع الأولوية",
    ],
    category: "priority",
    inStock: true,
    featured: true,
  },
  {
    id: "interview",
    name: "مقابلة فورية",
    description: "احصل على مقابلة فورية مع إدارة السيرفر عبر ديسكورد",
    longDescription: `
      المترتب Discord إذا قمت بشراء هذا المنتج، مستقبلي رول بشكل تلقائي على حساب الديسكورد الخاص بك.. و يمكنك من إجراء المقابلة الصوتية بشكل فوري بدون الانتظار لأوقات التفعيل المحددة.
    `,
    price: 30.0,
    image: "/images/interview.png",
    features: [
      "قبل شرائك للمنتج، يجب أن تتأكد من شروط المنتج",
      "لا يقبل لمن هم دون السادس عشر (+16)",
      "المنتج غير قابل للاسترجاع",
    ],
    category: "interview",
    inStock: true,
    featured: true,
  },
]

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch (e) {
        console.error("Failed to parse products from localStorage", e)
      }
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products, isClient])

  const addProduct = (product: Omit<Product, "id">) => {
    const id = product.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")

    setProducts((prevProducts) => [
      ...prevProducts,
      {
        ...product,
        id,
      },
    ])
  }

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product)),
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
  }

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id)
  }

  const applyDiscount = (id: string, discountPercentage: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          const originalPrice = product.originalPrice || product.price
          const discountedPrice = originalPrice * (1 - discountPercentage / 100)
          return {
            ...product,
            originalPrice: originalPrice,
            price: Number.parseFloat(discountedPrice.toFixed(2)),
            discount: discountPercentage,
          }
        }
        return product
      }),
    )
  }

  const removeDiscount = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id && product.originalPrice) {
          return {
            ...product,
            price: product.originalPrice,
            originalPrice: undefined,
            discount: undefined,
          }
        }
        return product
      }),
    )
  }

  const getFeaturedProducts = () => {
    return products.filter((product) => product.featured)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter((product) => product.category === category)
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        applyDiscount,
        removeDiscount,
        getFeaturedProducts,
        getProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
