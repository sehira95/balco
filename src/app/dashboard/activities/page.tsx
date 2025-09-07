'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, User, Package, Settings, AlertCircle } from 'lucide-react'

interface Activity {
  id: string
  type: 'production' | 'user' | 'system' | 'quality'
  title: string
  description: string
  user: string
  timestamp: string
  status?: 'success' | 'warning' | 'error'
}

const mockActivities: Activity[] = []

export default function ActivitiesPage() {
  const [activities] = useState<Activity[]>(mockActivities)
  const [filterType, setFilterType] = useState<string>('all')
  const router = useRouter()

  const filteredActivities = activities.filter(activity => 
    filterType === 'all' || activity.type === filterType
  )

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'production': return Package
      case 'user': return User
      case 'system': return Settings
      case 'quality': return AlertCircle
      default: return Clock
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'production': return 'text-blue-400'
      case 'user': return 'text-green-400'
      case 'system': return 'text-purple-400'
      case 'quality': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-orange-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-3 glass-effect rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-white">Tüm Aktiviteler</h1>
            <p className="text-gray-300">Sistem içindeki tüm aktiviteleri görüntüle</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect p-6 rounded-2xl mb-8"
        >
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'production', label: 'Üretim' },
              { key: 'user', label: 'Kullanıcı' },
              { key: 'system', label: 'Sistem' },
              { key: 'quality', label: 'Kalite' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Activities List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-effect p-6 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-slate-700/50 ${getActivityColor(activity.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold mb-1">{activity.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{activity.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {activity.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {activity.status && (
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Aktivite bulunamadı</h3>
            <p className="text-gray-500">Seçilen filtreye göre aktivite bulunmuyor</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
