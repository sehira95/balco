# BALCO Deployment Rehberi

## Vercel ile Deployment (Önerilen)

### 1. Hazırlık
```bash
# Projeyi GitHub'a yükle
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/balco.git
git push -u origin main
```

### 2. Vercel Setup
1. [vercel.com](https://vercel.com) → Sign up with GitHub
2. "New Project" → Import your repository
3. Framework: Next.js (otomatik algılar)
4. Deploy!

### 3. Environment Variables
Vercel dashboard'da şunları ekle:
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mock://test (veya gerçek MongoDB)
```

### 4. Custom Domain (İsteğe bağlı)
- Domain satın al (Godaddy, Namecheap)
- Vercel'da Domains → Add domain
- DNS ayarlarını güncelle

## Alternatif: Railway

### 1. Railway Deploy
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 2. Database Ekleme
```bash
railway add postgresql
```

## Alternatif: Netlify

### 1. Build Settings
- Build command: `npm run build`
- Publish directory: `out`

### 2. next.config.js güncellemesi
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

## Maliyet Karşılaştırması

| Platform | Ücretsiz Plan | Ücretli Plan |
|----------|---------------|--------------|
| Vercel | 100GB bandwidth | $20/ay |
| Railway | $5 kredi/ay | $5+/ay |
| Netlify | 100GB bandwidth | $19/ay |
| DigitalOcean | - | $5/ay |

## Önerilen Workflow

1. **Geliştirme**: Local development
2. **Test**: GitHub push → Vercel preview
3. **Production**: Main branch → Otomatik deploy
4. **Monitoring**: Vercel analytics dashboard

## SSL ve Domain

Tüm platformlar ücretsiz SSL sağlar:
- Vercel: vercel.app subdomain veya custom domain
- Railway: railway.app subdomain
- Netlify: netlify.app subdomain

## Performance Tips

1. **Next.js Image Optimization** aktif
2. **Static Generation** kullan
3. **Bundle Analyzer** ile optimization
4. **CDN** kullan (Vercel'da otomatik)

## Monitoring

- **Vercel Analytics**: Ücretsiz
- **Uptime monitoring**: UptimeRobot
- **Error tracking**: Sentry
