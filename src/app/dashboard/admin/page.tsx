'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Users, Shield, UserCheck, UserX, Search, Filter, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'operator'
  status: 'active' | 'inactive'
  lastLogin: string
  department: string
  createdAt: string
}

const mockUsers: User[] = []

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'operator',
    department: '',
    password: ''
  })
  const router = useRouter()

  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('users')
    if (saved) {
      setUsers(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever users change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('users', JSON.stringify(users))
    }
  }, [users, isClient])

  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.role && newUser.department && newUser.password) {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        })

        const data = await response.json()

        if (response.ok) {
          const newUserData: User = {
            id: data.user.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: 'active',
            lastLogin: 'Henüz giriş yapmadı',
            department: newUser.department,
            createdAt: new Date().toISOString().split('T')[0]
          }
          setUsers([newUserData, ...users])
          setNewUser({ name: '', email: '', role: 'user', department: '', password: '' })
          setShowAddModal(false)
          alert('Kullanıcı başarıyla oluşturuldu!')
        } else {
          alert(data.error || 'Kullanıcı oluşturulurken hata oluştu')
        }
      } catch (error) {
        console.error('Error creating user:', error)
        alert('Kullanıcı oluşturulurken hata oluştu')
      }
    } else {
      alert('Lütfen tüm alanları doldurun!')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      password: ''
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editingUser && newUser.name && newUser.email && newUser.role && newUser.department) {
      const updatedUser: User = {
        ...editingUser,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u))
      setNewUser({ name: '', email: '', role: 'user', department: '', password: '' })
      setShowEditModal(false)
      setEditingUser(null)
    } else {
      alert('Lütfen tüm alanları doldurun!')
    }
  }

  const handleDelete = (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/20'
      case 'user': return 'text-blue-400 bg-blue-400/20'
      case 'operator': return 'text-green-400 bg-green-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'inactive': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Yönetici'
      case 'user': return 'Kullanıcı'
      case 'operator': return 'Operatör'
      default: return role
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'inactive': return 'Pasif'
      default: return status
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const adminUsers = users.filter(u => u.role === 'admin').length

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
              <Shield className="w-10 h-10 text-red-400" />
              Admin Paneli
            </h1>
            <p className="text-gray-300">Kullanıcı yönetimi ve sistem kontrolü</p>
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
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Kullanıcı
            </motion.button>
          </motion.div>
        </div>

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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-white">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-white">{activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Yönetici</p>
                <p className="text-2xl font-bold text-white">{adminUsers}</p>
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
                placeholder="Kullanıcı, email veya departman ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tüm Roller</option>
                <option value="admin">Yönetici</option>
                <option value="user">Kullanıcı</option>
                <option value="operator">Operatör</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Kullanıcı</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rol</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Departman</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Durum</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Son Giriş</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{user.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{user.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{user.lastLogin}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        
                        {user.status === 'active' ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStatusToggle(user.id)}
                            className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-400/20 rounded-lg transition-colors"
                            title="Pasif Yap"
                          >
                            <UserX className="w-4 h-4" />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStatusToggle(user.id)}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/20 rounded-lg transition-colors"
                            title="Aktif Yap"
                          >
                            <UserCheck className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition-colors"
                          title="Sil"
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
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Kullanıcı bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinizi değiştirin veya yeni kullanıcı ekleyin</p>
          </motion.div>
        )}

        {/* Add User Modal */}
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
              <h3 className="text-2xl font-bold text-white mb-6">Yeni Kullanıcı Ekle</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' | 'operator' })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="operator">Operatör</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Departman"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Şifre"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setNewUser({ name: '', email: '', role: 'user', department: '', password: '' })
                  }}
                  className="flex-1 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-600/20 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all"
                >
                  Ekle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit User Modal */}
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
              <h3 className="text-2xl font-bold text-white mb-6">Kullanıcı Düzenle</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' | 'operator' })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="operator">Operatör</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Departman"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setNewUser({ name: '', email: '', role: 'user', department: '', password: '' })
                  }}
                  className="flex-1 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-600/20 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all"
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
