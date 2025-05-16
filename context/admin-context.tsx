"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type AdminCredentials = {
  username: string
  password: string
}

type AdminContextType = {
  isLoggedIn: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  updateCredentials: (credentials: AdminCredentials) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: "777",
    password: "777",
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (adminLoggedIn === "true") {
      setIsLoggedIn(true)
    }

    // Load saved credentials if they exist
    const savedCredentials = localStorage.getItem("adminCredentials")
    if (savedCredentials) {
      try {
        setCredentials(JSON.parse(savedCredentials))
      } catch (e) {
        console.error("Failed to parse admin credentials from localStorage", e)
      }
    }
  }, [])

  const login = (username: string, password: string) => {
    if (username === credentials.username && password === credentials.password) {
      setIsLoggedIn(true)
      localStorage.setItem("adminLoggedIn", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("adminLoggedIn")
  }

  const updateCredentials = (newCredentials: AdminCredentials) => {
    setCredentials(newCredentials)
    if (isClient) {
      localStorage.setItem("adminCredentials", JSON.stringify(newCredentials))
    }
  }

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout, updateCredentials }}>{children}</AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
