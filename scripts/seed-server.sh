#!/bin/bash

# BALCO MongoDB Seed Script for Server
echo "BALCO MongoDB Seed işlemi başlatılıyor..."

# MongoDB'ye bağlan ve veritabanını temizle
mongosh balco --eval "
// Önce mevcut verileri temizle
db.users.deleteMany({});
db.producttypes.deleteMany({});
db.colors.deleteMany({});

// Admin kullanıcısı ekle
db.users.insertOne({
  name: 'Admin',
  email: 'admin@balco.com',
  password: '\$2b\$12\$dRZYNyXNV728t.kE9Y6i1eux.rRKnNndKekimoOrTOUXsEBPgtM6K', // admin123
  role: 'admin',
  department: 'Yönetim',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Ürün türleri ekle
db.producttypes.insertMany([
  { name: 'Plastik Kasa', description: 'Elektronik cihazlar için plastik kasa', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Kapak', description: 'Çeşitli kapak türleri', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Tıpa', description: 'Şişe ve kap tıpaları', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Conta', description: 'Su geçirmez conta elemanları', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Düğme', description: 'Plastik düğme çeşitleri', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Oyuncak Parça', description: 'Çocuk oyuncakları için plastik parçalar', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Ambalaj', description: 'Gıda ve kozmetik ambalajları', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Çerçeve', description: 'Çeşitli çerçeve türleri', createdAt: new Date(), updatedAt: new Date() }
]);

// Renkler ekle
db.colors.insertMany([
  { name: 'Beyaz', hexCode: '#FFFFFF', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Siyah', hexCode: '#000000', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Kırmızı', hexCode: '#FF0000', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Mavi', hexCode: '#0000FF', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Yeşil', hexCode: '#00FF00', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Sarı', hexCode: '#FFFF00', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Turuncu', hexCode: '#FFA500', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Mor', hexCode: '#800080', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Gri', hexCode: '#808080', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Kahverengi', hexCode: '#8B4513', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Pembe', hexCode: '#FFC0CB', createdAt: new Date(), updatedAt: new Date() },
  { name: 'Lacivert', hexCode: '#000080', createdAt: new Date(), updatedAt: new Date() }
]);

print('✅ Admin kullanıcısı oluşturuldu: admin@balco.com / admin123');
print('✅ ' + db.producttypes.countDocuments() + ' ürün türü eklendi');
print('✅ ' + db.colors.countDocuments() + ' renk eklendi');
print('✅ BALCO MongoDB seed işlemi tamamlandı!');
"

echo "Seed işlemi tamamlandı. Şimdi API'ları test edebilirsiniz:"
echo "curl http://localhost:3000/api/product-types"
echo "curl http://localhost:3000/api/colors"
