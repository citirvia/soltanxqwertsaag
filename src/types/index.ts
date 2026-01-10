export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  imageSecondary?: string;
  images?: string[];
  description?: string;
  category: string;
  collections?: ('Top Sellers' | 'Full Collection')[];
  isNew?: boolean;
  story?: string;
  technicalSpecs?: string[];
  specs: {
    material: string;
    weight: string;
    resistance: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  // email: string; // Removed per user request
  contactNumber: string;
  address: string;
  items: CartItem[];
  total: number;
  timestamp: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export interface StoreContextType {
  products: Product[];
  isProductsLoading: boolean;
  cart: CartItem[];
  orders: Order[];
  isAdmin: boolean;
  isLoadingAdmin: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  checkoutStep: 'cart' | 'form';
  setCheckoutStep: (step: 'cart' | 'form') => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info') => void;
  openCheckout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  createOrder: (customer: { name: string; phone: string; address: string }) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<void>;
  updateOrderStatus: (orderId: string, status: 'pending' | 'shipped' | 'delivered') => Promise<void>;
  logoutAdmin: () => Promise<void>;
  selectedProduct: Product | null;
  viewProduct: (product: Product | null) => void;
  fetchProducts: () => Promise<void>;
}
