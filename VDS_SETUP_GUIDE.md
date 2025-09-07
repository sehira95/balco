# VDS Server Kurulum Rehberi

## 🎯 Hedef
BALCO Plastik Enjeksiyon Üretim Takip Sistemi'nin production server'da çalıştırılması

## 📋 Gereksinimler
- ✅ VDS sunucu (SATIN ALINDI)
- ✅ Domain: balcoenjeksiyon.xyz (SATIN ALINDI)
- 🔄 Server kurulumu (YAPILACAK)

## 🛠️ Kurulum Adımları

### 1. VDS Bağlantı Bilgileri
```
IP Adresi: [VDS sağlayıcısından alınacak]
Kullanıcı: root
Şifre: [VDS sağlayıcısından alınacak]
OS: Ubuntu 22.04 LTS (önerilen)
```

### 2. İlk Bağlantı ve Güncellemeler
```bash
# SSH ile bağlan
ssh root@[IP_ADRESI]

# Sistem güncellemeleri
apt update && apt upgrade -y

# Gerekli paketler
apt install -y curl wget git nano ufw
```

### 3. Node.js 20.x Kurulumu
```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js kur
apt install -y nodejs

# Kontrol et
node --version
npm --version
```

### 4. MongoDB 7.0 Kurulumu
```bash
# MongoDB GPG key ekle
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# MongoDB repository ekle
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Güncelle ve kur
apt update
apt install -y mongodb-org

# MongoDB'yi başlat ve etkinleştir
systemctl start mongod
systemctl enable mongod

# Kontrol et
systemctl status mongod
```

### 5. Nginx Kurulumu
```bash
# Nginx kur
apt install -y nginx

# Başlat ve etkinleştir
systemctl start nginx
systemctl enable nginx

# Kontrol et
systemctl status nginx
```

### 6. PM2 Process Manager Kurulumu
```bash
# PM2'yi global olarak kur
npm install -g pm2

# PM2'yi sistem başlangıcında çalıştır
pm2 startup
```

### 7. Firewall Ayarları
```bash
# UFW'yi etkinleştir
ufw enable

# Gerekli portları aç
ufw allow ssh
ufw allow 80
ufw allow 443

# Durumu kontrol et
ufw status
```

### 8. BALCO Projesini Clone Et
```bash
# Proje dizini oluştur
mkdir -p /var/www
cd /var/www

# GitHub'dan clone et
git clone https://github.com/sehira95/balco.git
cd balco

# Dependencies kur
npm install

# Production build
npm run build
```

### 9. Environment Variables Ayarla
```bash
# .env dosyası oluştur
nano .env.local
```

İçeriği:
```env
NEXTAUTH_URL=https://balcoenjeksiyon.xyz
NEXTAUTH_SECRET=your-super-secret-key-here
MONGODB_URI=mongodb://localhost:27017/balco
NODE_ENV=production
```

### 10. Nginx Configuration
```bash
# Nginx config dosyası oluştur
nano /etc/nginx/sites-available/balco
```

İçeriği:
```nginx
server {
    listen 80;
    server_name balcoenjeksiyon.xyz www.balcoenjeksiyon.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Site'ı etkinleştir
ln -s /etc/nginx/sites-available/balco /etc/nginx/sites-enabled/

# Default site'ı kaldır
rm /etc/nginx/sites-enabled/default

# Nginx'i yeniden başlat
systemctl restart nginx
```

### 11. SSL Sertifikası (Let's Encrypt)
```bash
# Certbot kur
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
certbot --nginx -d balcoenjeksiyon.xyz -d www.balcoenjeksiyon.xyz

# Otomatik yenileme test et
certbot renew --dry-run
```

### 12. BALCO Uygulamasını Başlat
```bash
cd /var/www/balco

# PM2 ile başlat
pm2 start npm --name "balco" -- start

# PM2 config'i kaydet
pm2 save
```

### 13. Domain DNS Ayarları
VDS sağlayıcısında veya domain panelinde:
```
A Record: balcoenjeksiyon.xyz -> [VDS_IP_ADRESI]
A Record: www.balcoenjeksiyon.xyz -> [VDS_IP_ADRESI]
```

## 🔍 Kontrol Komutları
```bash
# Servis durumları
systemctl status mongod
systemctl status nginx
pm2 status

# Log'ları kontrol et
pm2 logs balco
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MongoDB bağlantısı test et
mongosh
```

## 🚀 Sonuç
- ✅ BALCO sistemi: https://balcoenjeksiyon.xyz
- ✅ MongoDB: localhost:27017
- ✅ SSL sertifikası aktif
- ✅ PM2 ile process management
- ✅ Nginx reverse proxy

## 🔧 Bakım Komutları
```bash
# Proje güncelleme
cd /var/www/balco
git pull
npm run build
pm2 restart balco

# SSL yenileme
certbot renew

# Sistem güncellemeleri
apt update && apt upgrade -y
```

## 📞 Sorun Giderme
1. **Site açılmıyor**: Nginx ve PM2 durumunu kontrol et
2. **Database bağlantısı**: MongoDB servisini kontrol et
3. **SSL sorunu**: Certbot log'larını kontrol et
4. **Domain çözümlenmiyor**: DNS ayarlarını kontrol et

---
**Kurulum tamamlandıktan sonra sistem tamamen kullanıma hazır olacak!**
