'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, Search, Grid, List, Home, Palette } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Product {
  id: string
  name: string
  category: string
  colors: string[]
  description?: string
  createdAt: string
}

const mockProducts: Product[] = []

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    colors: '',
    description: ''
  })
  const router = useRouter()

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('products')
    if (saved) {
      setProducts(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever products change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('products', JSON.stringify(products))
    }
  }, [products, isClient])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      colors: product.colors.join(', '),
      description: product.description || ''
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editingProduct && newProduct.name && newProduct.category && newProduct.description) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        category: newProduct.category,
        colors: newProduct.colors ? newProduct.colors.split(',').map(c => c.trim()) : [],
        description: newProduct.description
      }
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
      setNewProduct({ name: '', category: '', colors: '', description: '' })
      setShowEditModal(false)
      setEditingProduct(null)
    } else {
      alert('Lütfen zorunlu alanları doldurun!')
    }
  }

  const handleDelete = (productId: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600'
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  }

  const handleAddProduct = () => {
    console.log('Adding new product...')
    setShowAddModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Package className="w-10 h-10 text-blue-400" />
              Ürün Yönetimi
            </h1>
            <p className="text-gray-300">Ürün çeşitleri ve kategori yönetimi</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              size="sm"
              className="text-white border-white/20 hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProduct}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Ürün
            </motion.button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Toplam Ürün</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Kategoriler</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Toplam Renk</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(products.flatMap(p => p.colors)).size}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect p-6 rounded-2xl mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ürün veya kategori ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-800/50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-effect rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300"
              >
                <div className={`h-32 bg-gradient-to-br ${getRandomGradient()} flex items-center justify-center`}>
                  <Package className="w-16 h-16 text-white/80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.category}</p>
                  
                  {product.description && (
                    <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-2">Mevcut Renkler:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded-lg"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">{product.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ürün</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Kategori</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Renkler</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Açıklama</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tarih</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getRandomGradient()} rounded-lg flex items-center justify-center`}>
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.colors.slice(0, 3).map((color, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded-lg"
                            >
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="px-2 py-1 bg-slate-600 text-gray-400 text-xs rounded-lg">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm">
                          {product.description || 'Açıklama yok'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{product.createdAt}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinizi değiştirin veya yeni ürün ekleyin</p>
          </motion.div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-effect p-8 rounded-2xl max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Yeni Ürün Ekle</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Ürün adı"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Kategori"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Renkler (virgülle ayırın)"
                  value={newProduct.colors}
                  onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Açıklama"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setNewProduct({ name: '', category: '', colors: '', description: '' })
                  }}
                  className="flex-1 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-600/20 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    if (newProduct.name && newProduct.category && newProduct.description) {
                      const newProductData: Product = {
                        id: Math.random().toString(36).substr(2, 9),
                        name: newProduct.name,
                        category: newProduct.category,
                        colors: newProduct.colors ? newProduct.colors.split(',').map(c => c.trim()) : [],
                        description: newProduct.description,
                        createdAt: new Date().toISOString().split('T')[0]
                      }
                      setProducts([newProductData, ...products])
                      setNewProduct({ name: '', category: '', colors: '', description: '' })
                      setShowAddModal(false)
                      console.log('New product added:', newProductData)
                    } else {
                      alert('Lütfen zorunlu alanları doldurun!')
                    }
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Ekle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-effect p-8 rounded-2xl max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Ürün Düzenle</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Ürün adı"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Kategori"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Renkler (virgülle ayırın)"
                  value={newProduct.colors}
                  onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Açıklama"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProduct(null)
                    setNewProduct({ name: '', category: '', colors: '', description: '' })
                  }}
                  className="flex-1 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-600/20 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Güncelle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
