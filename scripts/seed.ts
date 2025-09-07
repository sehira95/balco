import connectDB from '../src/lib/mongodb'
import { User } from '../src/models/User'
import { ProductType } from '../src/models/ProductType'
import { Color } from '../src/models/Color'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    await connectDB()
    console.log('MongoDB bağlantısı kuruldu')

    // Admin kullanıcısı oluştur
    const existingAdmin = await User.findOne({ email: 'admin@balco.com' })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      await User.create({
        name: 'Admin',
        email: 'admin@balco.com',
        password: hashedPassword,
        role: 'admin'
      })
      console.log('Admin kullanıcısı oluşturuldu: admin@balco.com / admin123')
    }

    // Örnek ürün türleri
    const productTypes = [
      { name: 'Plastik Kasa', description: 'Elektronik cihazlar için plastik kasa' },
      { name: 'Kapak', description: 'Çeşitli kapak türleri' },
      { name: 'Tıpa', description: 'Şişe ve kap tıpaları' },
      { name: 'Conta', description: 'Su geçirmez conta elemanları' },
      { name: 'Düğme', description: 'Plastik düğme çeşitleri' }
    ]

    for (const pt of productTypes) {
      const existing = await ProductType.findOne({ name: pt.name })
      if (!existing) {
        await ProductType.create(pt)
        console.log(`Ürün türü oluşturuldu: ${pt.name}`)
      }
    }

    // Örnek renkler
    const colors = [
      { name: 'Beyaz', hexCode: '#FFFFFF' },
      { name: 'Siyah', hexCode: '#000000' },
      { name: 'Kırmızı', hexCode: '#FF0000' },
      { name: 'Mavi', hexCode: '#0000FF' },
      { name: 'Yeşil', hexCode: '#00FF00' },
      { name: 'Sarı', hexCode: '#FFFF00' },
      { name: 'Turuncu', hexCode: '#FFA500' },
      { name: 'Mor', hexCode: '#800080' },
      { name: 'Gri', hexCode: '#808080' },
      { name: 'Kahverengi', hexCode: '#8B4513' }
    ]

    for (const color of colors) {
      const existing = await Color.findOne({ name: color.name })
      if (!existing) {
        await Color.create(color)
        console.log(`Renk oluşturuldu: ${color.name}`)
      }
    }

    console.log('Seed işlemi tamamlandı!')
    process.exit(0)
  } catch (error) {
    console.error('Seed hatası:', error)
    process.exit(1)
  }
}

seed()
