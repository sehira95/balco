# BALCO VDS Kurulum Komutları

## Server Bilgileri
- IP: 45.141.151.170
- User: root
- Pass: V1Lup2NyW3
- OS: Ubuntu 22.04 LTS

## Kurulum Komutları (Sırayla Çalıştır)

### 1. İlk Bağlantı ve Sistem Güncelleme
```bash
ssh root@45.141.151.170

# Sistem güncellemeleri
apt update && apt upgrade -y

# Gerekli paketler
apt install -y curl wget git nano ufw software-properties-common
```

### 2. Node.js 20.x Kurulumu
```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js kur
apt install -y nodejs

# Kontrol et
node --version
npm --version
```

### 3. MongoDB 7.0 Kurulumu
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
systemctl status mongod
```

### 4. Nginx Kurulumu
```bash
# Nginx kur
apt install -y nginx

# Başlat ve etkinleştir
systemctl start nginx
systemctl enable nginx
systemctl status nginx
```

### 5. PM2 Process Manager
```bash
# PM2'yi global olarak kur
npm install -g pm2

# PM2'yi sistem başlangıcında çalıştır
pm2 startup
```

### 6. Firewall Ayarları
```bash
# UFW'yi etkinleştir
ufw --force enable

# Gerekli portları aç
ufw allow ssh
ufw allow 80
ufw allow 443
ufw status
```

### 7. BALCO Projesini İndir
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

### 8. Environment Variables
```bash
# .env.local dosyası oluştur
cat > .env.local << 'EOF'
NEXTAUTH_URL=https://balcoenjeksiyon.xyz
NEXTAUTH_SECRET=super-secret-key-for-balco-production-2024
MONGODB_URI=mongodb://localhost:27017/balco
NODE_ENV=production
EOF
```

### 9. Nginx Configuration
```bash
# Nginx config dosyası oluştur
cat > /etc/nginx/sites-available/balco << 'EOF'
server {
    listen 80;
    server_name balcoenjeksiyon.xyz www.balcoenjeksiyon.xyz 45.141.151.170;

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
EOF

# Site'ı etkinleştir
ln -s /etc/nginx/sites-available/balco /etc/nginx/sites-enabled/

# Default site'ı kaldır
rm -f /etc/nginx/sites-enabled/default

# Nginx test et ve yeniden başlat
nginx -t
systemctl restart nginx
```

### 10. BALCO Uygulamasını Başlat
```bash
cd /var/www/balco

# PM2 ile başlat
pm2 start npm --name "balco" -- start

# PM2 config'i kaydet
pm2 save

# PM2 durumu kontrol et
pm2 status
```

### 11. SSL Sertifikası (Let's Encrypt)
```bash
# Certbot kur
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al (domain DNS'i ayarlandıktan sonra)
# certbot --nginx -d balcoenjeksiyon.xyz -d www.balcoenjeksiyon.xyz

# Şimdilik IP ile test edebiliriz
echo "SSL kurulumu domain DNS ayarları tamamlandıktan sonra yapılacak"
```

### 12. Test Komutları
```bash
# Servisleri kontrol et
systemctl status mongod
systemctl status nginx
pm2 status

# MongoDB bağlantısı test et
mongosh --eval "db.adminCommand('ismaster')"

# Web test et
curl http://localhost:3000
curl http://45.141.151.170
```

## DNS Ayarları Gerekli
Domain panelinde şu kayıtları ekle:
```
A Record: balcoenjeksiyon.xyz -> 45.141.151.170
A Record: www.balcoenjeksiyon.xyz -> 45.141.151.170
```

## Test URL'leri
- IP ile: http://45.141.151.170
- Domain ile: http://balcoenjeksiyon.xyz (DNS ayarlandıktan sonra)
- SSL sonrası: https://balcoenjeksiyon.xyz

---
Kurulum tamamlandıktan sonra BALCO sistemi tam olarak çalışacak!
