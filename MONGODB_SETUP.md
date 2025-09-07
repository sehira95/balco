# MongoDB Atlas Kurulum Rehberi

## 1. MongoDB Atlas Hesabı Oluştur
1. [MongoDB Atlas](https://cloud.mongodb.com)'a git
2. "Sign up" → Ücretsiz hesap oluştur
3. "Create a New Cluster" → M0 (FREE) seç
4. Region: AWS / Frankfurt (en yakın)

## 2. Database Kullanıcısı Oluştur
1. Database Access → Add New Database User
2. Username: `balco-user`
3. Password: `BalcoPassword123!`
4. Role: Read and Write to any database

## 3. IP Whitelist
1. Network Access → Add IP Address
2. "Allow Access from Anywhere" (0.0.0.0/0)
3. (Güvenlik için sadece kendi IP'ni de ekleyebilirsin)

## 4. Connection String Al
1. Clusters → Connect → Connect your application
2. Node.js driver seç
3. Connection string'i kopyala:
```
mongodb+srv://balco-user:BalcoPassword123!@cluster0.xxxxx.mongodb.net/balco-production?retryWrites=true&w=majority
```

## 5. Vercel'da Environment Variable Güncelle
```
MONGODB_URI=mongodb+srv://balco-user:BalcoPassword123!@cluster0.xxxxx.mongodb.net/balco-production?retryWrites=true&w=majority
```

## 6. Sonuç
✅ Gerçek database
✅ Tüm cihazlarda aynı veri  
✅ Ücretsiz 512MB
✅ Otomatik backup

## Alternative: Supabase (PostgreSQL)
1. [Supabase](https://supabase.com) - 500MB ücretsiz
2. Daha kolay setup
3. Real-time sync
