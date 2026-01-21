import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingCart, Plus, Trash2, Edit2, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { sanitizeString, sanitizeNumber } from '../lib/utils';

export default function AdminDashboard() {
  const { products, isProductsLoading, orders, deleteProduct, addProduct, updateProduct, updateOrderStatus, logoutAdmin, isAdmin, isLoadingAdmin, fetchProducts } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    imageSecondary: '',
    category: '',
    collections: [] as ('Top Sellers' | 'Full Collection')[],
    isNew: false,
    story: '',
    technicalSpecs: '',
    sizes: [] as string[],
    material: '',
    weight: '',
    resistance: ''
  });
  const [imageHint, setImageHint] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAdmin && !isAdmin) {
      navigate('/vault-x921-soltan-private-access');
    }
  }, [isAdmin, isLoadingAdmin, navigate]);



  const handleLogout = () => {
      logoutAdmin();
      navigate('/vault-x921-soltan-private-access');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', image: '', imageSecondary: '', category: '', collections: [], isNew: false, story: '', technicalSpecs: '', sizes: [], material: '', weight: '', resistance: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      imageSecondary: product.imageSecondary || '',
      category: product.category,
      collections: product.collections || [],
      isNew: !!product.isNew,
      story: product.story || product.description || '',
      technicalSpecs: (product.technicalSpecs || []).join('\n'),
      sizes: product.sizes || [],
      material: product.specs.material,
      weight: product.specs.weight,
      resistance: product.specs.resistance
    });
    setIsModalOpen(true);
  };

  const readFileAsDataURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFile = async (file: File, which: 'main' | 'secondary') => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      if (which === 'main') {
        setFormData(prev => ({ ...prev, image: dataUrl }));
      } else {
        setFormData(prev => ({ ...prev, imageSecondary: dataUrl }));
      }
      setImageHint('');
    } catch {
      setImageHint('Failed to read image file.');
    }
  };

  const handleImagePaste = async (e: React.ClipboardEvent<HTMLInputElement>, which: 'main' | 'secondary') => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        if (blob) {
          await handleImageFile(blob, which);
          e.preventDefault();
          return;
        }
      }
    }
    const text = e.clipboardData.getData('text');
    if (text.startsWith('blob:')) {
      setImageHint('Paste the actual image or use Upload instead of blob URLs.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Warn about large images
    if (formData.image.length > 5000000 || (formData.imageSecondary && formData.imageSecondary.length > 5000000)) {
        if (!window.confirm("Warning: One of your images is very large (over 5MB). This might cause the database to reject it or slow down your site significantly. Do you want to try anyway?")) {
            return;
        }
    }

    const productData = {
      name: sanitizeString(formData.name),
      price: sanitizeNumber(formData.price),
      image: sanitizeString(formData.image),
      imageSecondary: formData.imageSecondary ? sanitizeString(formData.imageSecondary) : undefined,
      category: sanitizeString(formData.category),
      collections: formData.collections,
      isNew: formData.isNew,
      story: sanitizeString(formData.story),
      technicalSpecs: formData.technicalSpecs
        .split('\n')
        .map(s => sanitizeString(s))
        .filter(s => s.length > 0),
      sizes: formData.sizes,
      specs: {
        material: sanitizeString(formData.material),
        weight: sanitizeString(formData.weight),
        resistance: sanitizeString(formData.resistance)
      }
    };

    let success = false;
    if (editingProduct) {
      success = await updateProduct({ ...productData, id: editingProduct.id });
    } else {
      success = await addProduct(productData);
    }
    
    if (success) {
        setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-soltan-black text-white font-mono relative">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-soltan-gray/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
        <h1 className="text-sm tracking-[0.2em] uppercase text-soltan-cyan">Soltan // Command Center</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-xs hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
            LOGOUT
        </button>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 bottom-0 w-64 bg-soltan-gray/30 border-r border-white/5 p-4 hidden md:block">
        <nav className="space-y-2">
            <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase transition-colors ${activeTab === 'products' ? 'bg-soltan-purple/20 text-soltan-purple border border-soltan-purple/50' : 'hover:bg-white/5 text-white/50'}`}
            >
                <Package className="w-4 h-4" />
                Products
            </button>
            <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase transition-colors ${activeTab === 'orders' ? 'bg-soltan-cyan/20 text-soltan-cyan border border-soltan-cyan/50' : 'hover:bg-white/5 text-white/50'}`}
            >
                <ShoppingCart className="w-4 h-4" />
                Orders
            </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 mt-16 p-8 pb-32">
        <AnimatePresence mode='wait'>
            {activeTab === 'products' ? (
                <motion.div 
                    key="products"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl tracking-widest uppercase">Inventory Protocol</h2>
                        <div className="flex gap-2">
                            <button onClick={() => fetchProducts()} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                                Refresh
                            </button>
                            <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-soltan-purple text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                                <Plus className="w-4 h-4" />
                                Add Unit
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {isProductsLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-soltan-cyan mb-4"></div>
                                <p className="text-white/50 text-xs tracking-widest uppercase">Syncing with Mainframe...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12 border border-white/5 bg-white/5">
                                <p className="text-white/50 text-xs tracking-widest uppercase">Inventory Empty</p>
                            </div>
                        ) : (
                            products.map(product => (
                                <div key={product.id} className="bg-soltan-gray border border-white/5 p-4 flex items-center justify-between group hover:border-white/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover" />
                                        <div>
                                            <h3 className="text-sm font-bold uppercase">{product.name}</h3>
                                            <p className="text-xs text-white/40">${product.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(product)} className="p-2 hover:text-soltan-cyan transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => deleteProduct(product.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <h2 className="text-xl tracking-widest uppercase mb-8">Order Feed</h2>
                    
                    <div className="space-y-4">
                        {orders.length === 0 && <p className="text-white/30 text-center py-8">No active orders found.</p>}
                        {orders.map(order => (
                            <div key={order.id} className="bg-soltan-gray border border-white/5 p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-soltan-cyan text-xs tracking-widest uppercase mb-1">ID: #{order.id}</h3>
                                        <p className="text-lg font-bold">{order.customerName}</p>
                                        <div className="text-xs text-white/50 space-y-1 mt-1">
                                            <p>{order.contactNumber}</p>
                                            <p>{order.address}</p>
                                            <p>{new Date(order.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border ${
                                        order.status === 'pending' ? 'border-yellow-500 text-yellow-500' :
                                        order.status === 'shipped' ? 'border-soltan-purple text-soltan-purple' :
                                        'border-green-500 text-green-500'
                                    }`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="border-t border-white/5 py-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-white/70 mb-1">
                                            <span>
                                              {item.name} x{item.quantity}
                                              {item.selectedSize && (
                                                <span className="ml-2 text-xs text-soltan-cyan">
                                                  [Size: {item.selectedSize}]
                                                </span>
                                              )}
                                              {Array.isArray(item.collections) && item.collections.length > 0 && (
                                                <span className="ml-2 text-xs text-soltan-purple">
                                                  [{item.collections.join(' · ')}]
                                                </span>
                                              )}
                                            </span>
                                            <span>${item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-white/5">
                                        <span>Total</span>
                                        <span>${order.total}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <a 
                                        href={`https://wa.me/${order.contactNumber}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex-1 py-2 text-center border border-white/10 hover:bg-green-500/20 hover:text-green-500 hover:border-green-500 transition-colors text-xs uppercase tracking-widest"
                                    >
                                        WhatsApp
                                    </a>
                                    {order.status === 'pending' && (
                                        <button 
                                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                                            className="flex-1 py-2 bg-soltan-purple text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            Mark Shipped
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button 
                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            className="flex-1 py-2 bg-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-green-500 transition-colors"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-2xl bg-soltan-gray border border-white/10 p-8 max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl tracking-widest uppercase">{editingProduct ? 'Edit Unit' : 'Initialize Unit'}</h2>
                        <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 hover:text-red-500" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Name</label>
                                <input required className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Price</label>
                                <input required type="number" className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Image URL (Main)</label>
                                <input required className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.image} 
                                    onChange={e => {
                                      setFormData({...formData, image: e.target.value});
                                      if (e.target.value.startsWith('blob:')) setImageHint('Use Upload or paste the image, not a blob URL.');
                                      else setImageHint('');
                                    }} 
                                    onPaste={(e) => handleImagePaste(e, 'main')}
                                />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 1024 * 1024 * 2) { // 2MB limit warning
                                            setImageHint('Warning: Image is large (>2MB). Consider compressing it for better performance.');
                                        } else {
                                            setImageHint('');
                                        }
                                        await handleImageFile(file, 'main');
                                    }
                                  }}
                                />
                                {imageHint && <p className="text-xs text-soltan-purple">{imageHint}</p>}
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Image URL (Secondary)</label>
                                <input className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.imageSecondary} 
                                    onChange={e => setFormData({...formData, imageSecondary: e.target.value})} 
                                    onPaste={(e) => handleImagePaste(e, 'secondary')}
                                />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) await handleImageFile(file, 'secondary');
                                  }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Category</label>
                                <input required className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Collections</label>
                                <div className="flex items-center gap-4 text-xs">
                                    <label className="flex items-center gap-2">
                                        <input 
                                          type="checkbox" 
                                          checked={formData.collections.includes('Top Sellers')}
                                          onChange={e => {
                                            const checked = e.target.checked;
                                            setFormData(prev => ({
                                              ...prev,
                                              collections: checked 
                                                ? Array.from(new Set([...(prev.collections||[]), 'Top Sellers']))
                                                : (prev.collections||[]).filter(c => c !== 'Top Sellers')
                                            }))
                                          }}
                                        />
                                        Top Sellers
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input 
                                          type="checkbox" 
                                          checked={formData.collections.includes('Full Collection')}
                                          onChange={e => {
                                            const checked = e.target.checked;
                                            setFormData(prev => ({
                                              ...prev,
                                              collections: checked 
                                                ? Array.from(new Set([...(prev.collections||[]), 'Full Collection']))
                                                : (prev.collections||[]).filter(c => c !== 'Full Collection')
                                            }))
                                          }}
                                        />
                                        Full Collection
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Mark as New Arrival</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      checked={formData.isNew}
                                      onChange={e => setFormData({...formData, isNew: e.target.checked})}
                                    />
                                    <span className="text-white/60">NEW</span>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">The Story</label>
                                <textarea 
                                  rows={5}
                                  className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none resize-y" 
                                  value={formData.story} 
                                  onChange={e => setFormData({...formData, story: e.target.value})} 
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Available Sizes</label>
                                <div className="flex flex-wrap gap-3">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <label key={size} className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-white/10 cursor-pointer hover:border-soltan-purple transition-colors">
                                            <input 
                                              type="checkbox" 
                                              checked={formData.sizes.includes(size)}
                                              onChange={e => {
                                                const checked = e.target.checked;
                                                setFormData(prev => ({
                                                  ...prev,
                                                  sizes: checked 
                                                    ? [...prev.sizes, size]
                                                    : prev.sizes.filter(s => s !== size)
                                                }))
                                              }}
                                            />
                                            <span className="text-xs font-bold">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Technical Specs (one per line)</label>
                                <textarea 
                                  rows={4}
                                  className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none resize-y" 
                                  value={formData.technicalSpecs} 
                                  onChange={e => setFormData({...formData, technicalSpecs: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Material</label>
                                <input required className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Weight</label>
                                <input required className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Resistance</label>
                                <input required className="w-full bg-black/50 border border-white/10 p-3 focus:border-soltan-purple outline-none" 
                                    value={formData.resistance} onChange={e => setFormData({...formData, resistance: e.target.value})} />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-soltan-purple text-black font-bold uppercase tracking-widest hover:bg-white transition-colors mt-8">
                            {editingProduct ? 'Update Protocol' : 'Execute Launch'}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-soltan-gray/80 backdrop-blur-lg border-t border-white/10 z-50 flex justify-around p-4">
        <button 
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest ${activeTab === 'products' ? 'text-soltan-purple' : 'text-white/50'}`}
        >
            <Package className="w-5 h-5" />
            Products
        </button>
        <button 
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest ${activeTab === 'orders' ? 'text-soltan-cyan' : 'text-white/50'}`}
        >
            <ShoppingCart className="w-5 h-5" />
            Orders
        </button>
      </nav>
    </div>
  );
}
