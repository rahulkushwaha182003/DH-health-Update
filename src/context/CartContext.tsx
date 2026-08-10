import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  parametersCount?: number;
  fastingRequired?: boolean;
  labName?: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const mergeCarts = (local: CartItem[], remote: CartItem[]): CartItem[] => {
  if (!local || local.length === 0) return remote || [];
  if (!remote || remote.length === 0) return local;

  const localLab = local[0].labName || "Other Labs";
  const remoteLab = remote[0].labName || "Other Labs";

  if (localLab === remoteLab) {
    const merged = [...remote];
    local.forEach((localItem) => {
      if (!merged.some((remoteItem) => remoteItem.id === localItem.id || remoteItem.name === localItem.name)) {
        merged.push(localItem);
      }
    });
    return merged;
  } else {
    return local;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("hub_cart");
    return saved ? JSON.parse(saved) : [];
  });


  const [user, setUser] = useState<any>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch initial auth session and sync cart if needed
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          const remoteCart = session.user.user_metadata?.cart_items || [];
          const localCart = JSON.parse(localStorage.getItem("hub_cart") || "[]");

          const mergedCart = mergeCarts(localCart, remoteCart);
          setCartItems(mergedCart);
          
          if (JSON.stringify(remoteCart) !== JSON.stringify(mergedCart)) {
            setTimeout(async () => {
              try {
                await supabase.auth.updateUser({ data: { cart_items: mergedCart } });
              } catch (err) {
                console.error("[CartContext] error updating cart in auth event:", err);
              }
            }, 0);
          }
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          // Optionally clear cart on sign out
          setCartItems([]);
          localStorage.removeItem("hub_cart");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync to local storage and Supabase remote metadata on changes
  useEffect(() => {
    localStorage.setItem("hub_cart", JSON.stringify(cartItems));

    // Sync to Supabase user metadata
    if (user) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

      // Debounce updates to avoid rate-limiting
      syncTimeoutRef.current = setTimeout(async () => {
        const metadataCart = user.user_metadata?.cart_items;
        // Basic check to avoid re-syncing if identical
        if (JSON.stringify(metadataCart) !== JSON.stringify(cartItems)) {
          await supabase.auth.updateUser({
            data: { cart_items: cartItems }
          });
        }
      }, 1000);
    }
  }, [cartItems, user]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if item already exists in cart
      if (prev.find((i) => i.id === item.id || i.name === item.name)) {
        toast.error("Test is already in the cart!");
        return prev;
      }

      // Enforce "one lab at a time" rule
      if (prev.length > 0) {
        const currentLab = prev[0].labName || "Other Labs";
        const newItemLab = item.labName || "Other Labs";
        
        if (currentLab !== newItemLab) {
          toast.error(`You can only book tests from one lab at a time. Your cart currently contains tests from "${currentLab}". Please clear your cart to add tests from "${newItemLab}".`);
          return prev;
        }
      }

      toast.success(`${item.name} added to cart!`);
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id && i.name !== id));
    toast.success("Test removed from cart");
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price),
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
