import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, Order, StoreContextType, ToastMessage } from '../types';
import { supabase } from '../lib/supabase';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper functions for mapping
const mapSupabaseProduct = (item: any): Product => ({
  id: item.id,
  name: item.name,
  price: Number(item.price),
  image: item.image,
  images: item.images || [],
  description: item.description,
  category: item.category,
  specs: item.specs || {},
  collections: item.collections || [],
  isNew: item.is_new,
  story: item.story,
  technicalSpecs: item.technical_specs || [],
  sizes: item.sizes || []
});

const mapSupabaseProducts = (data: any[]): Product[] => {
  return data.map(mapSupabaseProduct);
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const productsInitialized = useRef(false);
  const productsChannelRef = useRef<any>(null);

  // Initialize products IMMEDIATELY - don't wait for auth
  useEffect(() => {
    if (productsInitialized.current) return;
    productsInitialized.current = true;

    const initProducts = async () => {
      console.log('[Products] Starting initialization...');
      setIsProductsLoading(true);

      try {
        // Fast, simple fetch - no complex logic
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('[Products] Fetch error:', error);
          throw error;
        }

        if (data) {
          const mapped = mapSupabaseProducts(data);
          setProducts(mapped);
          console.log(`[Products] Loaded ${mapped.length} products`);
          
          // Cache
          if (typeof window !== 'undefined') {
            localStorage.setItem('soltan_products_cache', JSON.stringify(mapped));
          }
        }

        // Setup realtime AFTER initial load
        productsChannelRef.current = supabase
          .channel('products_realtime')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'products' },
            (payload) => {
              console.log('[Products] Realtime event:', payload.eventType);
              
              if (payload.eventType === 'INSERT') {
                const newProduct = mapSupabaseProduct(payload.new);
                setProducts(prev => [...prev, newProduct].sort((a, b) => a.id - b.id));
              } else if (payload.eventType === 'UPDATE') {
                const updated = mapSupabaseProduct(payload.new);
                setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
              } else if (payload.eventType === 'DELETE') {
                setProducts(prev => prev.filter(p => p.id !== payload.old.id));
              }
            }
          )
          .subscribe();

      } catch (err: any) {
        console.error('[Products] Init error:', err);
        
        // Try cache
        if (typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem('soltan_products_cache');
            if (cached) {
              setProducts(JSON.parse(cached));
              console.log('[Products] Loaded from cache');
            }
          } catch (cacheErr) {
            console.error('[Products] Cache error:', cacheErr);
          }
        }
      } finally {
        setIsProductsLoading(false);
      }
    };

    initProducts();

    return () => {
      if (productsChannelRef.current) {
        supabase.removeChannel(productsChannelRef.current);
      }
    };
  }, []);

  // Manual refresh
  const fetchProducts = async () => {
    console.log('[Products] Manual refresh...');
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) {
        const mapped = mapSupabaseProducts(data);
        setProducts(mapped);
        console.log(`[Products] Refreshed: ${mapped.length} items`);
      }
    } catch (err) {
      console.error('[Products] Refresh error:', err);
      showToast('Failed to refresh products', 'info');
    }
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !cartLoaded) {
      try {
        const saved = localStorage.getItem('soltan_cart');
        if (saved) setCart(JSON.parse(saved));
        setCartLoaded(true);
      } catch (e) {
        console.error('[Cart] Load error:', e);
        setCartLoaded(true);
      }
    }
  }, [cartLoaded]);

  // Admin state - SIMPLIFIED with timeout protection
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState<boolean>(true);
  const adminCheckInProgress = useRef(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const ordersChannelRef = useRef<any>(null);

  // Admin check with TIMEOUT PROTECTION
  useEffect(() => {
    // Prevent concurrent checks
    if (adminCheckInProgress.current) {
      console.log('[Admin] Check already in progress, skipping...');
      return;
    }

    adminCheckInProgress.current = true;

    const checkAdmin = async () => {
      console.log('[Admin] Starting check...');
      setIsLoadingAdmin(true);

      // TIMEOUT: Force complete after 5 seconds
      const timeout = setTimeout(() => {
        console.warn('[Admin] Check timeout, defaulting to non-admin');
        setIsAdmin(false);
        setIsLoadingAdmin(false);
        adminCheckInProgress.current = false;
      }, 5000);

      try {
        // Get session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 3000)
        );

        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (!session?.user?.email) {
          console.log('[Admin] No session found');
          clearTimeout(timeout);
          setIsAdmin(false);
          setIsLoadingAdmin(false);
          adminCheckInProgress.current = false;
          return;
        }

        console.log('[Admin] Session found, checking whitelist...');

        // Quick whitelist check with timeout
        const whitelistPromise = supabase
          .from('admin_whitelist')
          .select('email')
          .eq('email', session.user.email)
          .maybeSingle();

        const whitelistTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Whitelist timeout')), 2000)
        );

        const result = await Promise.race([
          whitelistPromise,
          whitelistTimeout
        ]) as any;

        const { data, error } = result;

        const isAdminUser = !error && !!data;
        setIsAdmin(isAdminUser);
        console.log('[Admin] Check complete:', isAdminUser ? 'authorized' : 'unauthorized');

      } catch (err: any) {
        console.error('[Admin] Check error:', err.message);
        setIsAdmin(false);
      } finally {
        clearTimeout(timeout);
        setIsLoadingAdmin(false);
        adminCheckInProgress.current = false;
      }
    };

    checkAdmin();

    // Auth state listener with debounce
    let authTimeout: NodeJS.Timeout;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Admin] Auth event:', event);
      
      // Debounce rapid auth events
      clearTimeout(authTimeout);
      
      if (event === 'SIGNED_IN' && session?.user?.email) {
        authTimeout = setTimeout(async () => {
          if (adminCheckInProgress.current) return;
          
          adminCheckInProgress.current = true;
          try {
            const { data } = await Promise.race([
              supabase
                .from('admin_whitelist')
                .select('email')
                .eq('email', session.user.email)
                .maybeSingle(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
            ]) as any;
            
            setIsAdmin(!!data);
          } catch (err) {
            console.error('[Admin] Auth event check error:', err);
            setIsAdmin(false);
          } finally {
            adminCheckInProgress.current = false;
          }
        }, 500); // 500ms debounce
        
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setOrders([]);
      }
    });

    return () => {
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Fetch orders ONLY when admin status is confirmed
  useEffect(() => {
    // Don't fetch if still loading admin status or not admin
    if (isLoadingAdmin || !isAdmin) {
      if (!isAdmin && orders.length > 0) {
        setOrders([]);
      }
      return;
    }

    console.log('[Orders] Admin confirmed, fetching orders...');

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100); // Limit for performance
        
        if (error) throw error;
        
        if (data) {
          const mapped: Order[] = data.map((order: any) => ({
            id: order.id,
            customerName: order.customer_name,
            email: order.customer_email,
            contactNumber: order.customer_phone,
            address: order.customer_address,
            items: order.items,
            total: Number(order.total),
            status: order.status,
            timestamp: order.created_at
          }));
          setOrders(mapped);
          console.log(`[Orders] Loaded ${mapped.length} orders`);
        }
      } catch (err) {
        console.error('[Orders] Fetch error:', err);
      }
    };

    fetchOrders();

    // Realtime for orders
    ordersChannelRef.current = supabase
      .channel('orders_realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          console.log('[Orders] Realtime update');
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      if (ordersChannelRef.current) {
        supabase.removeChannel(ordersChannelRef.current);
      }
    };
  }, [isAdmin, isLoadingAdmin]);

  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form'>('cart');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Persist cart
  useEffect(() => {
    if (typeof window !== 'undefined' && cartLoaded) {
      localStorage.setItem('soltan_cart', JSON.stringify(cart));
    }
  }, [cart, cartLoaded]);

  // Persist orders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('soltan_orders', JSON.stringify(orders));
    }
  }, [orders]);
  
  // Admin session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isAdmin) {
        sessionStorage.setItem('soltan_admin_session', JSON.stringify({ timestamp: Date.now() }));
        const interval = setInterval(() => {
          const saved = sessionStorage.getItem('soltan_admin_session');
          if (saved) {
            const data = JSON.parse(saved);
            sessionStorage.setItem('soltan_admin_session', JSON.stringify({ ...data, timestamp: Date.now() }));
          }
        }, 60000);
        return () => clearInterval(interval);
      } else {
        sessionStorage.removeItem('soltan_admin_session');
      }
    }
  }, [isAdmin]);

  // Cart actions
  const addToCart = (product: Product, selectedSize?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map(item => item.id === product.id && item.selectedSize === selectedSize ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
    showToast("Secured in Vault");
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  // Order creation
  const createOrder = async (customer: { name: string; phone: string; address: string }) => {
    console.log('[Order] Creating...');
    
    // Email validation removed per user request
    if (customer.name.trim().length < 2) {
      showToast('Name is too short', 'info');
      return false;
    }

    const calculatedTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    
    const sanitizedCustomer = {
      name: customer.name.replace(/[<>]/g, '').trim(),
      phone: customer.phone.replace(/[<>]/g, '').trim(),
      address: customer.address.replace(/[<>]/g, '').trim()
    };

    // Extract sizes from cart items
    const orderSizes = cart
      .filter(item => item.selectedSize)
      .map(item => item.selectedSize as string);

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      id: orderId,
      customerName: sanitizedCustomer.name,
      // email removed
      contactNumber: sanitizedCustomer.phone,
      address: sanitizedCustomer.address,
      items: [...cart],
      total: calculatedTotal,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          id: newOrder.id,
          customer_name: newOrder.customerName,
          // customer_email removed
          customer_phone: newOrder.contactNumber,
          customer_address: newOrder.address,
          items: newOrder.items,
          sizes: orderSizes,
          total: newOrder.total,
          status: newOrder.status
        }]);

      if (error) throw error;

      console.log('[Order] Created:', orderId);
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      showToast('Order placed successfully');
      return true;
    } catch (err: any) {
      console.error('[Order] Error:', err);
      showToast('Failed to create order', 'info');
      return false;
    }
  };

  // Product management
  const addProduct = async (product: Omit<Product, 'id'>) => {
    console.log('[Product] Adding:', product.name);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          price: product.price,
          image: product.image,
          images: product.images || [],
          description: product.description,
          category: product.category,
          specs: product.specs || {},
          collections: product.collections || [],
          is_new: product.isNew,
          story: product.story,
          technical_specs: product.technicalSpecs || [],
          sizes: product.sizes || []
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        console.log('[Product] Added:', data.id);
        showToast('Product added successfully');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[Product] Add error:', err);
      showToast(`Failed to add product: ${err.message}`, 'info');
      return false;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    console.log('[Product] Updating:', updatedProduct.id);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          image: updatedProduct.image,
          images: updatedProduct.images,
          description: updatedProduct.description,
          category: updatedProduct.category,
          specs: updatedProduct.specs,
          collections: updatedProduct.collections,
          is_new: updatedProduct.isNew,
          story: updatedProduct.story,
          technical_specs: updatedProduct.technicalSpecs,
          sizes: updatedProduct.sizes || []
        })
        .eq('id', updatedProduct.id);

      if (error) throw error;

      console.log('[Product] Updated');
      showToast('Product updated successfully');
      return true;
    } catch (err: any) {
      console.error('[Product] Update error:', err);
      showToast('Failed to update product', 'info');
      return false;
    }
  };

  const deleteProduct = async (id: number) => {
    console.log('[Product] Deleting:', id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      console.log('[Product] Deleted');
      showToast('Product deleted');
    } catch (err: any) {
      console.error('[Product] Delete error:', err);
      showToast('Failed to delete product', 'info');
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'shipped' | 'delivered') => {
    console.log('[Order] Updating status:', orderId, status);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) throw error;
      
      console.log('[Order] Status updated');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast(`Order #${orderId} marked as ${status}`);
    } catch (err: any) {
      console.error('[Order] Status error:', err);
      showToast('Failed to update order status', 'info');
    }
  };

  const logoutAdmin = async () => {
    console.log('[Admin] Logging out...');
    await supabase.auth.signOut();
    setIsAdmin(false);
    setOrders([]);
  };

  const viewProduct = (product: Product | null) => {
    setSelectedProduct(product);
  };

  const openCheckout = () => {
    setCheckoutStep('form');
    setIsCartOpen(true);
  };

  return (
    <StoreContext.Provider value={{
      products,
      isProductsLoading,
      cart,
      orders,
      isAdmin,
      isCartOpen,
      setIsCartOpen,
      checkoutStep,
      setCheckoutStep,
      toast,
      showToast,
      isLoadingAdmin,
      openCheckout,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      createOrder,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      logoutAdmin,
      selectedProduct,
      viewProduct,
      fetchProducts
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};