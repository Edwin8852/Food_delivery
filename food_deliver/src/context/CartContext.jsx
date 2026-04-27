import { createContext, useContext, useState } from "react";

// ✅ Create Context
const CartContext = createContext();

// ✅ Custom Hook (BEST PRACTICE)
export const useCart = () => useContext(CartContext);

// ✅ Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Helper to get consistent ID
  const getItemId = (item) => item.id || item._id || item.name;

  // 🔥 Add to Cart
  const addToCart = (product) => {
    const productId = getItemId(product);
    setCart((prev) => {
      const existing = prev.find((item) => getItemId(item) === productId);

      if (existing) {
        return prev.map((item) =>
          getItemId(item) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 🔥 Increase Quantity
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        getItemId(item) === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // 🔥 Decrease Quantity
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          getItemId(item) === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🔥 Remove Item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => getItemId(item) !== id));
  };

  // 🔥 Clear Cart
  const clearCart = () => setCart([]);

  // 🔥 Get Quantity
  const getQuantity = (id) => {
    const item = cart.find((item) => getItemId(item) === id);
    return item ? item.quantity : 0;
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,      // ✅ IMPORTANT
        increaseQty,
        decreaseQty,
        removeFromCart, // ✅ EXTRA
        clearCart,
        getQuantity,    // ✅ ADDED
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
