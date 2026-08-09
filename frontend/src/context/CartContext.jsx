import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axiosInstance from "../utils/axiosInstance";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [addingMealId, setAddingMealId] = useState(null);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/cart/my-cart");

      if (res.data.success) {
        const items = res.data.data?.items || [];

        const total = items.reduce((sum, item) => sum + item.quantity, 0);

        setCartCount(total);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const addToCart = useCallback(
    async (mealId, quantity = 1) => {
      try {
        setAddingMealId(mealId);

        const res = await axiosInstance.post("/cart/add", {
          mealId,
          quantity,
        });

        if (res.data.success) {
          await fetchCartCount();

          return {
            success: true,
            message: "Meal Added Successfully",
          };
        }

        return {
          success: false,
          message: res.data.message,
        };
      } catch (err) {
        console.log(err.response?.data || err);

        return {
          success: false,
          message:
            err.response?.data?.message ||
            err.message ||
            "Something went wrong",
        };
      } finally {
        setAddingMealId(null);
      }
    },
    [fetchCartCount],
  );

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        addingMealId,
        fetchCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
