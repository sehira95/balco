'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Factory, BarChart3, Users, Palette, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

// Sabit pozisyonlar hydration sorununu önlemek için
const particlePositions = [
  { left: 10, top: 20 }, { left: 85, top: 10 }, { left: 30, top: 80 },
  { left: 70, top: 30 }, { left: 15, top: 60 }, { left: 90, top: 70 },
  { left: 45, top: 15 }, { left: 25, top: 40 }, { left: 80, top: 85 },
  { left: 5, top: 45 }, { left: 60, top: 75 }, { left: 35, top: 5 },
  { left: 95, top: 50 }, { left: 50, top: 90 }, { left: 20, top: 25 },
  { left: 75, top: 55 }, { left: 40, top: 35 }, { left: 65, top: 15 },
  { left: 10, top: 75 }, { left: 85, top: 40 }
]

export default function HomePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const features = [
    {
      icon: Factory,
      title: 'Akıllı Üretim Takibi',
      description: 'Gerçek zamanlı üretim verilerini takip edin ve optimize edin',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Gelişmiş Analitik',
      description: 'AI destekli raporlar ve tahminlemelerle geleceği öngörün',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Ekip Yönetimi',
      description: 'Gelişmiş yetki kontrolü ve ekip performans takibi',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Palette,
      title: 'Dinamik Konfigürasyon',
      description: 'Sınırsız ürün çeşidi ve renk seçenekleri yönetimi',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { label: '7/24', desc: 'Kesintisiz İzleme', icon: Zap },
    { label: '99.9%', desc: 'Sistem Güvenilirliği', icon: Shield },
    { label: '∞', desc: 'Sınırsız Ölçeklenebilirlik', icon: Sparkles }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent)]"></div>
      </div>

      {/* Floating Particles */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: (i % 3) + 2, // 2-4 saniye arası sabit değerler
                repeat: Infinity,
                delay: (i % 5) * 0.4, // 0-1.6 saniye arası sabit gecikme
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-8xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              BALCO
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight"
          >
            Yeni Nesil Plastik Enjeksiyon
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Üretim Takip Sistemi
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Yapay zeka destekli analitik, gerçek zamanlı izleme ve otomatik raporlama ile 
            üretim süreçlerinizi dijital çağa taşıyın. Endüstri 4.0&apos;ın gücünü keşfedin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              onClick={() => router.push('/login')}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-2xl"
            >
              Sisteme Giriş Yap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border-2 border-blue-400/50 text-blue-400 font-semibold text-lg rounded-2xl hover:bg-blue-400/10 transition-all duration-300"
              onClick={() => router.push('/login')}
            >
              Daha Fazla Bilgi
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
              className="glass-effect p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-300"
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-400 group-hover:text-purple-400 transition-colors" />
              <div className="text-4xl font-bold text-white mb-2">{stat.label}</div>
              <div className="text-gray-300">{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + index * 0.15, duration: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
              }}
              className="glass-effect p-8 rounded-3xl group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="glass-effect p-12 rounded-3xl text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Üretimde Devrim Yaratmaya Hazır mısınız?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            BALCO ile üretim süreçlerinizi optimize edin ve rekabette öne geçin.
          </p>
          <motion.button
            onClick={() => router.push('/login')}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl transition-all duration-300"
          >
            Hemen Başla
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="text-center mt-16 text-gray-400"
        >
          <p className="flex items-center justify-center gap-2">
            © 2024 BALCO Üretim Takip Sistemi. 
            <span className="text-blue-400">Geleceği Şekillendirir</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
