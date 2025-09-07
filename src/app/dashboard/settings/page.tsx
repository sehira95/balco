'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Settings, User, Lock, Bell, Palette, Database, Shield, Save, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState({
    production: true,
    quality: true,
    maintenance: false,
    reports: true,
  })
  const [selectedTheme, setSelectedTheme] = useState('Dark')
  const [selectedLanguage, setSelectedLanguage] = useState('tr')

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Lock },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'appearance', label: 'Görünüm', icon: Palette },
    { id: 'system', label: 'Sistem', icon: Database },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Settings className="w-10 h-10 text-blue-400" />
              Sistem Ayarları
            </h1>
            <p className="text-gray-300">Uygulama ve hesap ayarlarınızı yönetin</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-effect rounded-2xl p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass-effect rounded-2xl p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Profil Bilgileri</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        defaultValue={session?.user?.name || "Kullanıcı"}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={session?.user?.email || ""}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Departman
                      </label>
                      <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500">
                        <option>Yönetim</option>
                        <option>Üretim</option>
                        <option>Kalite Kontrol</option>
                        <option>Bakım</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        placeholder="+90 5xx xxx xx xx"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      console.log('Saving profile settings...')
                      // Save profile logic here
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Değişiklikleri Kaydet
                  </motion.button>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Güvenlik Ayarları</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/30 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-green-400" />
                      <h3 className="text-white font-semibold">İki Faktörlü Doğrulama</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      Hesabınızın güvenliğini artırmak için iki faktörlü doğrulamayı etkinleştirin.
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Etkinleştir
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert('Şifre güncelleme işlemi başlatıldı!')
                      console.log('Password update initiated')
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Şifreyi Güncelle
                  </motion.button>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Bildirim Ayarları</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                        <div>
                          <h3 className="text-white font-medium">
                            {key === 'production' && 'Üretim Bildirimleri'}
                            {key === 'quality' && 'Kalite Uyarıları'}
                            {key === 'maintenance' && 'Bakım Hatırlatıcıları'}
                            {key === 'reports' && 'Rapor Bildirimleri'}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {key === 'production' && 'Üretim durumu ve hedef bildirileri'}
                            {key === 'quality' && 'Kalite kontrol uyarıları'}
                            {key === 'maintenance' && 'Periyodik bakım hatırlatmaları'}
                            {key === 'reports' && 'Günlük ve haftalık raporlar'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            value ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              value ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert('Bildirim ayarları kaydedildi!')
                      console.log('Notification settings saved:', notifications)
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Bildirimleri Kaydet
                  </motion.button>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Görünüm Ayarları</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-3">Tema Seçimi</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['Dark', 'Light', 'Auto'].map((theme) => (
                          <div
                            key={theme}
                            onClick={() => {
                              setSelectedTheme(theme)
                              console.log('Theme changed to:', theme)
                            }}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              theme === selectedTheme 
                                ? 'border-blue-500 bg-blue-500/20' 
                                : 'border-slate-600 hover:border-slate-500'
                            }`}
                          >
                            <div className="w-full h-20 rounded-lg mb-2 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                            <p className="text-white text-center">{theme}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-3">Dil Seçimi</h3>
                      <select 
                        value={selectedLanguage}
                        onChange={(e) => {
                          setSelectedLanguage(e.target.value)
                          console.log('Language changed to:', e.target.value)
                        }}
                        className="w-full md:w-64 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert('Görünüm ayarları kaydedildi!')
                      console.log('Appearance settings saved:', { theme: selectedTheme, language: selectedLanguage })
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Görünümü Kaydet
                  </motion.button>
                </motion.div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Sistem Bilgileri</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/30 p-4 rounded-xl">
                      <h3 className="text-white font-semibold mb-2">Uygulama Bilgileri</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Versiyon:</span>
                          <span className="text-white">v1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Build:</span>
                          <span className="text-white">2024.12.04</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Environment:</span>
                          <span className="text-white">Production</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 p-4 rounded-xl">
                      <h3 className="text-white font-semibold mb-2">Database Bilgileri</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Durum:</span>
                          <span className="text-green-400">Aktif</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Son Backup:</span>
                          <span className="text-white">04.12.2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Kayıt Sayısı:</span>
                          <span className="text-white">1,247</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        alert('Veritabanı yedekleme başlatıldı!')
                        console.log('Database backup initiated')
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Veritabanı Yedekle
                    </button>
                    <button 
                      onClick={() => {
                        alert('Önbellek temizlendi!')
                        console.log('Cache cleared successfully')
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Cache Temizle
                    </button>
                    <button 
                      onClick={() => {
                        alert('Sistem güncellemesi başlatıldı!')
                        console.log('System update initiated')
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Sistem Güncellemesi
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
