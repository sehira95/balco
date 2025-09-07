# BALCO - Plastik Enjeksiyon Üretim Takip Sistemi

Profesyonel plastik enjeksiyon üretim süreçlerini takip etmek ve analiz etmek için geliştirilmiş modern web uygulaması.

## 🚀 Özellikler

### 🏭 Üretim Yönetimi
- **Üretim Kaydı Ekleme/Silme**: Günlük üretim miktarlarını kaydetme
- **Ürün Çeşitleri**: Farklı ürün tiplerini yönetme
- **Renk Seçenekleri**: Ürün renklerini takip etme
- **Vardiya Takibi**: Sabah, öğleden sonra, gece vardiya kayıtları

### 📊 Analiz ve Raporlama
- **Günlük Üretim**: Günlük üretim miktarları
- **Haftalık Analiz**: Haftalık üretim trendleri
- **Tarih Bazlı Sorgular**: Belirli tarih aralıklarında üretim verileri
- **Kalite Takibi**: A, B, C kalite sınıflandırması

### 👥 Kullanıcı ve Yetki Yönetimi
- **Giriş Sistemi**: Güvenli authentication
- **Admin Paneli**: Yönetici yetkili kullanıcılar için özel panel
- **Kullanıcı Ekleme/Silme**: Admin tarafından kullanıcı yönetimi
- **Rol Bazlı Yetkilendirme**: Admin ve normal kullanıcı rolleri

### 🎨 Tasarım ve UX
- **Dark Theme**: Göz yorucu olmayan koyu tema
- **Responsive Design**: Mobil ve masaüstü uyumlu
- **Animasyonlar**: Framer Motion ile profesyonel animasyonlar
- **Modern UI**: Tailwind CSS ile çağdaş tasarım

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Management**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (local veya cloud)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd balco
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın**
`.env.local` dosyası oluşturun:
```env
MONGODB_URI=mongodb://localhost:27017/balco-production
NEXTAUTH_SECRET=balco-super-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=balco-jwt-secret-key-2024
```

4. **Veritabanını hazırlayın**
```bash
npm run seed
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 🔐 Varsayılan Giriş Bilgileri

**Admin Kullanıcı:**
- Email: admin@balco.com
- Şifre: admin123

## 📱 Kullanım

### Giriş Yapma
1. Ana sayfada "Sisteme Giriş" butonuna tıklayın
2. Admin bilgilerini girin
3. Dashboard'a yönlendirileceksiniz

### Üretim Kaydı Ekleme
1. Dashboard'dan "Yeni Üretim Kaydı" seçin
2. Ürün türü, renk, miktar bilgilerini girin
3. Vardiya ve operatör bilgilerini ekleyin
4. Kalite sınıfını seçin
5. Kaydedin

### Admin Paneli
1. Admin hesabıyla giriş yapın
2. "Admin Panel" menüsünü seçin
3. Kullanıcı, ürün türü ve renk yönetimi yapın

## 🔧 Geliştirme

### Proje Yapısı
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API endpoints
│   ├── dashboard/      # Dashboard sayfaları
│   ├── login/          # Giriş sayfası
│   └── admin/          # Admin paneli
├── components/         # React bileşenleri
│   ├── ui/            # UI bileşenleri
│   ├── admin/         # Admin bileşenleri
│   └── dashboard/     # Dashboard bileşenleri
├── lib/               # Yardımcı fonksiyonlar
├── models/            # MongoDB şemaları
└── types/             # TypeScript tipleri
```

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

## 🚀 Deployment

### Vercel ile Deployment (Önerilen)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/balco)

**Adım Adım:**
1. GitHub'a projeyi yükleyin
2. [Vercel.com](https://vercel.com)'a gidin
3. "New Project" → GitHub repository'yi seçin
4. Environment Variables ekleyin:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=super-secret-key-123
   MONGODB_URI=mock://localhost
   ```
5. Deploy butonuna basın

### Diğer Platformlar
- **Railway**: $5/ay - Full-stack hosting
- **DigitalOcean**: $4/ay - VDS ile tam kontrol
- **Netlify**: Static hosting için uygun değil

## 🔐 Giriş Bilgileri

**Admin Kullanıcı:**
- Email: admin@balco.com
- Şifre: admin123

**Standart Kullanıcı:**
- Email: user@balco.com
- Şifre: user123

## 📊 Veritabanı Şeması

### Users
- name, email, password, role, timestamps

### ProductTypes
- name, description, timestamps

### Colors
- name, hexCode, timestamps

### ProductionRecords
- productType (ref), color (ref), quantity, date, shift, operator, notes, quality, createdBy (ref), timestamps

## 🔒 Güvenlik

- Şifreler bcryptjs ile hash'lenir
- JWT token'lar ile session yönetimi
- Role-based access control
- Input validation Zod ile

## 📈 Performans

- Server-side rendering
- Image optimization
- Code splitting
- MongoDB indexing

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Commit atın
4. Push edin
5. Pull request açın

## 📄 Lisans

Bu proje özel lisans altındadır.

## 📞 İletişim

Herhangi bir sorun veya öneriniz için issue açabilirsiniz.

---

**BALCO** - Plastik Enjeksiyon Üretim Takip Sistemi  
Made with ❤️ by AI Assistant