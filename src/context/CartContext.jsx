
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'crumb-and-co-cart';
const MAX_QUANTITY = 20;

function isValidCartItem(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function loadSavedCart() {
  try {
    if (typeof window === 'undefined') return [];

    const savedCart = window.localStorage.getItem(
      STORAGE_KEY
    );

    if (!savedCart) return [];

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) return [];

    return parsedCart
      .filter(isValidCartItem)
      .map((item) => ({
        ...item,
        quantity: Math.min(
          item.quantity,
          MAX_QUANTITY
        ),
      }));
  } catch (error) {
    console.error(
      'Unable to load shopping cart:',
      error
    );

    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(
    loadSavedCart
  );

  const [isCartOpen, setIsCartOpen] = useState(
    false
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        'Unable to save shopping cart:',
        error
      );
    }
  }, [cartItems]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (
        !product ||
        typeof product.id !== 'string' ||
        !product.id ||
        typeof product.name !== 'string' ||
        typeof product.price !== 'number' ||
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return;
      }

      const requestedQuantity = Math.min(
        quantity,
        MAX_QUANTITY
      );

      setCartItems((previousItems) => {
        const existingProduct = previousItems.find(
          (item) => item.id === product.id
        );

        if (existingProduct) {
          return previousItems.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(
                    MAX_QUANTITY,
                    item.quantity + requestedQuantity
                  ),
                }
              : item
          );
        }

        return [
          ...previousItems,
          {
            ...product,
            quantity: requestedQuantity,
          },
        ];
      });

      setIsCartOpen(true);
    },
    []
  );

  const updateQuantity = useCallback(
    (productId, delta) => {
      if (!Number.isInteger(delta)) return;

      setCartItems((previousItems) =>
        previousItems
          .map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: Math.min(
                    MAX_QUANTITY,
                    Math.max(
                      0,
                      item.quantity + delta
                    )
                  ),
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (productId) => {
      setCartItems((previousItems) =>
        previousItems.filter(
          (item) => item.id !== productId
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const contextValue = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider.'
    );
  }

  return context;
}
