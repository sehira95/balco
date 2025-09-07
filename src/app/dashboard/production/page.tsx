'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Factory, Package, Calendar, User, Search, Filter, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ProductionRecord {
  id: string
  productType: string
  color: string
  quantity: number
  date: string
  operator: string
  quality: 'A' | 'B' | 'C'
  machineId: string
  notes?: string
}

interface ProductType {
  _id: string
  name: string
}

interface Color {
  _id: string
  name: string
  hexCode: string
}

const mockRecords: ProductionRecord[] = []

export default function ProductionPage() {
  const [records, setRecords] = useState<ProductionRecord[]>(mockRecords)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuality, setSelectedQuality] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Modal form states
  const [newRecord, setNewRecord] = useState({
    productType: '',
    color: '',
    quantity: '',
    operator: '',
    machineId: ''
  })

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('production-records')
    if (saved) {
      setRecords(JSON.parse(saved))
    }
    
    // Fetch product types and colors from API
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [productTypesRes, colorsRes] = await Promise.all([
          fetch('/api/product-types'),
          fetch('/api/colors')
        ])
        
        if (productTypesRes.ok) {
          const productTypesData = await productTypesRes.json()
          setProductTypes(productTypesData)
        }
        
        if (colorsRes.ok) {
          const colorsData = await colorsRes.json()
          setColors(colorsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Save to localStorage whenever records change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('production-records', JSON.stringify(records))
    }
  }, [records, isClient])

  // Edit functionality
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEdit = (record: ProductionRecord) => {
    setEditingRecord(record)
    setNewRecord({
      productType: record.productType,
      color: record.color,
      quantity: record.quantity.toString(),
      operator: record.operator,
      machineId: record.machineId
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editingRecord && newRecord.productType && newRecord.color && newRecord.quantity && newRecord.operator && newRecord.machineId) {
      const updatedRecord: ProductionRecord = {
        ...editingRecord,
        productType: newRecord.productType,
        color: newRecord.color,
        quantity: parseInt(newRecord.quantity),
        operator: newRecord.operator,
        machineId: newRecord.machineId
      }
      setRecords(records.map(r => r.id === editingRecord.id ? updatedRecord : r))
      setNewRecord({ productType: '', color: '', quantity: '', operator: '', machineId: '' })
      setShowEditModal(false)
      setEditingRecord(null)
    } else {
      alert('Lütfen tüm alanları doldurun!')
    }
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.color.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesQuality = selectedQuality === 'all' || record.quality === selectedQuality
    return matchesSearch && matchesQuality
  })

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A': return 'text-green-400 bg-green-400/20'
      case 'B': return 'text-yellow-400 bg-yellow-400/20'
      case 'C': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const totalProduction = records.reduce((sum, record) => sum + record.quantity, 0)
  const avgQuality = records.filter(r => r.quality === 'A').length / records.length * 100

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
              <Factory className="w-10 h-10 text-blue-400" />
              Üretim Kayıtları
            </h1>
            <p className="text-gray-300">Günlük üretim takibi ve kalite kontrolü</p>
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
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Kayıt
            </motion.button>
          </motion.div>
        </div>

        {/* Add Record Modal */}
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
              <h3 className="text-2xl font-bold text-white mb-6">Yeni Üretim Kaydı</h3>
              
              <div className="space-y-4">
                <select 
                  value={newRecord.productType}
                  onChange={(e) => setNewRecord({...newRecord, productType: e.target.value})}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  <option value="">Ürün Seçin</option>
                  {productTypes.map((product) => (
                    <option key={product._id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <select 
                  value={newRecord.color}
                  onChange={(e) => setNewRecord({...newRecord, color: e.target.value})}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  <option value="">Renk Seçin</option>
                  {colors.map((color) => (
                    <option key={color._id} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Adet"
                  value={newRecord.quantity}
                  onChange={(e) => setNewRecord({...newRecord, quantity: e.target.value})}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Operatör"
                  value={newRecord.operator}
                  onChange={(e) => setNewRecord({...newRecord, operator: e.target.value})}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Makine ID"
                  value={newRecord.machineId}
                  onChange={(e) => setNewRecord({...newRecord, machineId: e.target.value})}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setNewRecord({ productType: '', color: '', quantity: '', operator: '', machineId: '' })
                  }}
                  className="flex-1 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-600/20 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    if (newRecord.productType && newRecord.color && newRecord.quantity && newRecord.operator && newRecord.machineId) {
                      const newRecordData: ProductionRecord = {
                        id: Math.random().toString(36).substr(2, 9),
                        productType: newRecord.productType,
                        color: newRecord.color,
                        quantity: parseInt(newRecord.quantity),
                        date: new Date().toISOString().split('T')[0],
                        operator: newRecord.operator,
                        quality: 'A',
                        machineId: newRecord.machineId
                      }
                      setRecords([newRecordData, ...records])
                      setNewRecord({ productType: '', color: '', quantity: '', operator: '', machineId: '' })
                      setShowAddModal(false)
                      console.log('New production record added:', newRecordData)
                    } else {
                      alert('Lütfen tüm alanları doldurun!')
                    }
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Kaydet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stats Cards */}
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
                <p className="text-gray-300 text-sm">Toplam Üretim</p>
                <p className="text-2xl font-bold text-white">{totalProduction.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Kalite Oranı</p>
                <p className="text-2xl font-bold text-white">%{avgQuality.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Toplam Kayıt</p>
                <p className="text-2xl font-bold text-white">{records.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect p-6 rounded-2xl mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ürün, operatör veya renk ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Quality Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tüm Kaliteler</option>
                <option value="A">Kalite A</option>
                <option value="B">Kalite B</option>
                <option value="C">Kalite C</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ürün</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Renk</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Adet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tarih</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Operatör</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Kalite</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Makine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-medium">{record.productType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{record.color}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">{record.quantity.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{record.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{record.operator}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getQualityColor(record.quality)}`}>
                        Kalite {record.quality}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{record.machineId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setRecords(records.filter(r => r.id !== record.id))
                            console.log('Delete record:', record.id)
                          }}
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

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Kayıt bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinizi değiştirin veya yeni kayıt ekleyin</p>
          </motion.div>
        )}

        {/* Edit Record Modal */}
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
              <h3 className="text-2xl font-bold text-white mb-6">Kayıt Düzenle</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Ürün türü"
                  value={newRecord.productType}
                  onChange={(e) => setNewRecord({ ...newRecord, productType: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Renk"
                  value={newRecord.color}
                  onChange={(e) => setNewRecord({ ...newRecord, color: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Miktar"
                  value={newRecord.quantity}
                  onChange={(e) => setNewRecord({ ...newRecord, quantity: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Operatör"
                  value={newRecord.operator}
                  onChange={(e) => setNewRecord({ ...newRecord, operator: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Makine ID"
                  value={newRecord.machineId}
                  onChange={(e) => setNewRecord({ ...newRecord, machineId: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingRecord(null)
                    setNewRecord({ productType: '', color: '', quantity: '', operator: '', machineId: '' })
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
