"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "./products-data";

// A "Context" is a shared box that any page wrapped inside it can read from.
// We keep the whole cart here so Home, Products, and Cart all share one cart.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  // The cart is a LIST of items: { name, price, quantity, image, color }.
  const [cart, setCart] = useState([]);

  // Guards against overwriting the saved cart before we've loaded it.
  const [loaded, setLoaded] = useState(false);

  // On first load in the browser, read any saved cart out of localStorage.
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // Whenever the cart changes (after loading), save it back to localStorage.
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, loaded]);

  // Add one of a product. If it's already in the cart, bump its quantity.
  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.name === product.name);
      if (existing) {
        return current.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  // Lower an item's quantity by one; remove the line if it reaches zero.
  function decreaseQuantity(name) {
    setCart((current) =>
      current
        .map((item) =>
          item.name === name ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Remove an item completely.
  function removeItem(name) {
    setCart((current) => current.filter((item) => item.name !== name));
  }

  // Empty the cart.
  function clearCart() {
    setCart([]);
  }

  // Totals, recalculated automatically whenever the cart changes.
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const totalPrice = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// A small shortcut so pages can grab the cart with: const { cart } = useCart();
export function useCart() {
  return useContext(CartContext);
}
