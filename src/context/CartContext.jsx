import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'armourcraft_cart_v1'

export function CartProvider({ children }) {
  // 1. Initialize cartItems: defaults to empty array [] for all new visitors (cart count = 0)
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (err) {
      console.warn('Failed to parse cart items from localStorage:', err)
    }
    return []
  })

  // Drawer & Checkout Modal states
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [cartToastItem, setCartToastItem] = useState(null)

  // 2. Synchronize cart state to localStorage whenever cartItems updates
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (err) {
      console.warn('Failed to save cart items to localStorage:', err)
    }
  }, [cartItems])

  // 3. Dynamic total cart count (sum of all item quantities)
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)

  // 4. Add item to cart with variant checking
  const addToCart = (configuredProduct) => {
    if (!configuredProduct) return

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.id === configuredProduct.id &&
          item.stance === configuredProduct.stance &&
          item.size === configuredProduct.size
      )

      if (existingIndex > -1) {
        const updated = [...prevItems]
        const currentQty = updated[existingIndex].quantity || 1
        const addQty = configuredProduct.quantity || 1
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + addQty
        }
        return updated
      }

      return [configuredProduct, ...prevItems]
    })

    // Trigger toast notification
    setCartToastItem(configuredProduct)
  }

  // 5. Update quantity of specific item
  const updateQuantity = (index, newQty) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index)
      }
      const updated = [...prev]
      if (updated[index]) {
        updated[index] = { ...updated[index], quantity: newQty }
      }
      return updated
    })
  }

  // 6. Remove item from cart
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }

  // 7. Clear ordered items
  const clearOrderedItems = (indices = []) => {
    setCartItems((prev) => prev.filter((_, i) => !indices.includes(i)))
  }

  // 8. Clear entire cart
  const clearCart = () => {
    setCartItems([])
  }

  const openCart = () => setIsCartDrawerOpen(true)
  const closeCart = () => setIsCartDrawerOpen(false)
  const openCheckout = () => {
    setIsCartDrawerOpen(false)
    setIsCheckoutOpen(true)
  }
  const closeCheckout = () => setIsCheckoutOpen(false)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearOrderedItems,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout,
        closeCheckout,
        cartToastItem,
        setCartToastItem
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
export default CartContext
