import React, { createContext, useContext, useState, useEffect } from 'react'
import { initialAdminProducts } from './data/initialProducts'
import { initialAdminOrders } from './data/initialOrders'

const AdminAuthContext = createContext(null)

const ADMIN_SESSION_KEY = 'armourcraft_admin_session_v1'
const ADMIN_USERS_KEY = 'armourcraft_admin_users_v1'
const ADMIN_PRODUCTS_KEY = 'armourcraft_admin_products_v1'
const ADMIN_ORDERS_KEY = 'armourcraft_admin_orders_v1'

// The secret passcode required to register a new admin account
export const REQUIRED_ADMIN_PASSCODE = 'ARMOUR2026'

const defaultAdminUser = {
  id: 'admin-master-01',
  name: 'Master Admin',
  email: 'admin@armourcraft.com',
  role: 'Super Administrator',
  avatar: '/images/avatar_david.png'
}

export function AdminAuthProvider({ children }) {
  // 1. Session state
  const [adminUser, setAdminUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const saved = window.localStorage.getItem(ADMIN_SESSION_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Error reading admin session:', e)
    }
    return null
  })

  // 2. Admin Users Store
  const [registeredAdmins, setRegisteredAdmins] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = window.localStorage.getItem(ADMIN_USERS_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Error reading registered admins:', e)
    }
    return [
      {
        email: 'admin@armourcraft.com',
        password: 'admin',
        name: 'Master Admin',
        role: 'Super Administrator'
      }
    ]
  })

  // 3. Products state
  const [products, setProducts] = useState(() => {
    if (typeof window === 'undefined') return initialAdminProducts
    try {
      const saved = window.localStorage.getItem(ADMIN_PRODUCTS_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Error reading admin products:', e)
    }
    return initialAdminProducts
  })

  // 4. Orders state
  const [orders, setOrders] = useState(() => {
    if (typeof window === 'undefined') return initialAdminOrders
    try {
      const saved = window.localStorage.getItem(ADMIN_ORDERS_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Error reading admin orders:', e)
    }
    return initialAdminOrders
  })

  // Persist session
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (adminUser) {
        window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser))
      } else {
        window.localStorage.removeItem(ADMIN_SESSION_KEY)
      }
    } catch (e) {
      console.warn('Error saving admin session:', e)
    }
  }, [adminUser])

  // Persist registered admins
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(registeredAdmins))
    } catch (e) {
      console.warn('Error saving registered admins:', e)
    }
  }, [registeredAdmins])

  // Persist products
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products))
    } catch (e) {
      console.warn('Error saving admin products:', e)
    }
  }, [products])

  // Persist orders
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders))
    } catch (e) {
      console.warn('Error saving admin orders:', e)
    }
  }, [orders])

  // Login handler
  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    
    // Check against registered admins or fallback master credentials
    const found = registeredAdmins.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    )

    if (found || (trimmedEmail === 'admin@armourcraft.com' && password === 'admin')) {
      const userToSet = found
        ? {
            id: `admin-${Date.now()}`,
            name: found.name || 'Admin',
            email: found.email,
            role: found.role || 'Staff Administrator',
            avatar: '/images/avatar_david.png'
          }
        : defaultAdminUser

      setAdminUser(userToSet)
      return { success: true }
    }

    return {
      success: false,
      error: 'Invalid admin email or password. Default test access: admin@armourcraft.com / admin'
    }
  }

  // Signup handler requiring secret passcode
  const signup = (name, email, password, passcode) => {
    const trimmedEmail = email.trim().toLowerCase()

    if (passcode.trim() !== REQUIRED_ADMIN_PASSCODE) {
      return {
        success: false,
        error: `Invalid Admin Passcode! Contact the project lead for authorization (Secret hint: ${REQUIRED_ADMIN_PASSCODE}).`
      }
    }

    const existing = registeredAdmins.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (existing) {
      return {
        success: false,
        error: 'An admin account with this email address already exists. Please log in.'
      }
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      role: 'Staff Administrator',
      avatar: '/images/avatar_david.png'
    }

    setRegisteredAdmins((prev) => [...prev, newAdmin])
    setAdminUser(newAdmin)
    return { success: true }
  }

  // Logout handler
  const logout = () => {
    setAdminUser(null)
  }

  // Product CRUD
  const addProduct = (newProduct) => {
    const itemToAdd = {
      ...newProduct,
      id: newProduct.id || `armor-${Date.now()}`,
      status: 'In Stock'
    }
    setProducts((prev) => [itemToAdd, ...prev])
  }

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    )
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // Order status update
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        signup,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
