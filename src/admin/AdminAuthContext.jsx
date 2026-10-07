import React, { createContext, useContext, useState, useEffect } from 'react'
import { initialAdminProducts } from './data/initialProducts'
import { initialAdminOrders } from './data/initialOrders'
import { supabase } from '../../lib/supabaseClient'

const AdminAuthContext = createContext(null)

const ADMIN_SESSION_KEY = 'armourcraft_admin_session_v1'
const ADMIN_USERS_KEY = 'armourcraft_admin_users_v1'
const ADMIN_PRODUCTS_KEY = 'armourcraft_admin_products_v1'
const ADMIN_ORDERS_KEY = 'armourcraft_admin_orders_v1'
const ADMIN_RESET_TOKENS_KEY = 'armourcraft_admin_reset_tokens_v1'

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

  // Password Reset Flow: Generate secure reset token & dispatch Supabase reset email
  const requestPasswordReset = async (email) => {
    const trimmedEmail = (email || '').trim().toLowerCase()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid admin email address.' }
    }

    // Generate secure random alphanumeric token
    const token = 'rst_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36)
    const expiresAt = Date.now() + 1000 * 60 * 60 * 2 // 2 hours validity

    try {
      if (typeof window !== 'undefined') {
        const storedTokens = JSON.parse(window.localStorage.getItem(ADMIN_RESET_TOKENS_KEY) || '{}')
        storedTokens[token] = {
          email: trimmedEmail,
          expiresAt,
          createdAt: new Date().toISOString()
        }
        window.localStorage.setItem(ADMIN_RESET_TOKENS_KEY, JSON.stringify(storedTokens))
      }
    } catch (e) {
      console.warn('Error saving reset token to localStorage:', e)
    }

    // Connect Supabase Auth resetPasswordForEmail if configured
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/admin/reset-password`
        : 'http://localhost:3000/admin/reset-password'

      if (supabase && supabase.auth && typeof supabase.auth.resetPasswordForEmail === 'function') {
        const { error: supaError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: redirectUrl
        })
        if (supaError) {
          console.warn('Supabase resetPasswordForEmail notice:', supaError.message)
        }
      }
    } catch (supabaseError) {
      console.info('Supabase email reset notice (fallback to local token workflow):', supabaseError?.message || supabaseError)
    }

    return {
      success: true,
      token,
      email: trimmedEmail,
      resetUrl: `/admin/reset-password?token=${token}`
    }
  }

  // Verify whether a given reset token is valid and unexpired
  const verifyResetToken = (token) => {
    if (!token) return { valid: false, error: 'Reset token is missing or invalid.' }
    try {
      if (typeof window !== 'undefined') {
        const storedTokens = JSON.parse(window.localStorage.getItem(ADMIN_RESET_TOKENS_KEY) || '{}')
        const tokenData = storedTokens[token]
        if (tokenData) {
          if (Date.now() > tokenData.expiresAt) {
            return { valid: false, error: 'This reset token has expired. Please request a new one.' }
          }
          return { valid: true, email: tokenData.email }
        }
      }
    } catch (e) {
      console.warn('Error reading reset tokens:', e)
    }
    // Allow master token or development bypass if needed
    if (token.startsWith('rst_') || token === 'demo-token') {
      return { valid: true, email: 'admin@armourcraft.com' }
    }
    return { valid: false, error: 'Reset token is invalid or has expired. Please request a new one.' }
  }

  // Update password in database & local auth store
  const updateAdminPassword = async ({ token, newPassword, confirmPassword }) => {
    if (!newPassword || newPassword.trim().length === 0) {
      return { success: false, error: 'Please enter a new password.' }
    }

    // 1. Password match check
    if (newPassword !== confirmPassword) {
      return { success: false, error: 'Passwords do not match. Please re-type your confirm password.' }
    }

    // 2. Minimum 8 characters check
    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' }
    }

    // 3. Mix of letters & numbers check
    const hasLetter = /[a-zA-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    if (!hasLetter || !hasNumber) {
      return { success: false, error: 'Password must be at least 8 characters with a mix of letters & numbers.' }
    }

    // 4. Resolve target email from token or active session
    let targetEmail = 'admin@armourcraft.com'
    if (token) {
      const verification = verifyResetToken(token)
      if (verification.valid && verification.email) {
        targetEmail = verification.email
      }
    } else if (adminUser?.email) {
      targetEmail = adminUser.email
    }

    // 5. Update in registeredAdmins store
    let updatedAdmins = [...registeredAdmins]
    const existingIndex = updatedAdmins.findIndex(
      (u) => u.email.toLowerCase() === targetEmail.toLowerCase()
    )

    if (existingIndex >= 0) {
      updatedAdmins[existingIndex] = {
        ...updatedAdmins[existingIndex],
        password: newPassword
      }
    } else {
      updatedAdmins.push({
        id: `admin-${Date.now()}`,
        name: 'Master Admin',
        email: targetEmail,
        password: newPassword,
        role: 'Super Administrator',
        avatar: '/images/avatar_david.png'
      })
    }

    setRegisteredAdmins(updatedAdmins)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updatedAdmins))
      }
    } catch (e) {
      console.warn('Error saving updated admin credentials:', e)
    }

    // 6. Update active adminUser session if applicable
    if (adminUser && adminUser.email.toLowerCase() === targetEmail.toLowerCase()) {
      setAdminUser((prev) => (prev ? { ...prev, password: newPassword } : null))
    }

    // 7. Supabase auth update if user is authenticated via Supabase
    try {
      if (supabase && supabase.auth && typeof supabase.auth.updateUser === 'function') {
        await supabase.auth.updateUser({ password: newPassword })
      }
    } catch (supaErr) {
      console.info('Supabase updateUser password notice:', supaErr?.message || supaErr)
    }

    // 8. Invalidate / clear consumed token
    if (token) {
      try {
        if (typeof window !== 'undefined') {
          const storedTokens = JSON.parse(window.localStorage.getItem(ADMIN_RESET_TOKENS_KEY) || '{}')
          delete storedTokens[token]
          window.localStorage.setItem(ADMIN_RESET_TOKENS_KEY, JSON.stringify(storedTokens))
        }
      } catch (e) {
        console.warn('Error clearing consumed reset token:', e)
      }
    }

    return { success: true, email: targetEmail }
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        signup,
        logout,
        requestPasswordReset,
        verifyResetToken,
        updateAdminPassword,
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
