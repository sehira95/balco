require('dotenv').config({ path: '.env.local' })
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/balco-production'

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB bağlantısı kuruldu')
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error)
    process.exit(1)
  }
}

// Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const ProductTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  hexCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const ProductType = mongoose.models.ProductType || mongoose.model('ProductType', ProductTypeSchema)
const Color = mongoose.models.Color || mongoose.model('Color', ColorSchema)

async function seed() {
  try {
    await connectDB()
    console.log('🌱 Veritabanı seed işlemi başlatılıyor...')

    // Admin kullanıcısı oluştur
    const adminExists = await User.findOne({ email: 'admin@balco.com' })
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      await User.create({
        name: 'Admin',
        email: 'admin@balco.com',
        password: hashedPassword,
        role: 'admin'
      })
      console.log('✅ Admin kullanıcısı oluşturuldu: admin@balco.com / admin123')
    } else {
      console.log('ℹ️  Admin kullanıcısı zaten mevcut')
    }

    // Test kullanıcısı oluştur
    const userExists = await User.findOne({ email: 'user@balco.com' })
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 12)
      await User.create({
        name: 'Test Kullanıcı',
        email: 'user@balco.com',
        password: hashedPassword,
        role: 'user'
      })
      console.log('✅ Test kullanıcısı oluşturuldu: user@balco.com / user123')
    } else {
      console.log('ℹ️  Test kullanıcısı zaten mevcut')
    }

    // Ürün çeşitleri oluştur
    const productTypes = [
      { name: 'Plastik Bardak', description: 'Tek kullanımlık plastik bardaklar' },
      { name: 'Plastik Tabak', description: 'Tek kullanımlık plastik tabaklar' },
      { name: 'Kaşık-Çatal Set', description: 'Plastik çatal kaşık setleri' },
      { name: 'Plastik Kap', description: 'Yemek kapları ve konteynerler' },
      { name: 'Su Şişesi', description: 'Plastik su şişeleri' }
    ]

    for (const productType of productTypes) {
      const exists = await ProductType.findOne({ name: productType.name })
      if (!exists) {
        await ProductType.create(productType)
        console.log(`✅ Ürün çeşidi oluşturuldu: ${productType.name}`)
      }
    }

    // Renkler oluştur
    const colors = [
      { name: 'Beyaz', hexCode: '#FFFFFF' },
      { name: 'Siyah', hexCode: '#000000' },
      { name: 'Kırmızı', hexCode: '#FF0000' },
      { name: 'Mavi', hexCode: '#0000FF' },
      { name: 'Yeşil', hexCode: '#00FF00' },
      { name: 'Sarı', hexCode: '#FFFF00' },
      { name: 'Turuncu', hexCode: '#FFA500' },
      { name: 'Pembe', hexCode: '#FFC0CB' },
      { name: 'Mor', hexCode: '#800080' },
      { name: 'Gri', hexCode: '#808080' }
    ]

    for (const color of colors) {
      const exists = await Color.findOne({ name: color.name })
      if (!exists) {
        await Color.create(color)
        console.log(`✅ Renk oluşturuldu: ${color.name}`)
      }
    }

    console.log('\n🎉 Seed işlemi başarıyla tamamlandı!')
    console.log('\n📝 Giriş Bilgileri:')
    console.log('👨‍💼 Admin: admin@balco.com / admin123')
    console.log('👤 User: user@balco.com / user123')
    
  } catch (error) {
    console.error('❌ Seed hatası:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 MongoDB bağlantısı kapatıldı')
    process.exit(0)
  }
}

seed()
