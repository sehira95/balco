# BALCO - Vercel Deployment Rehberi

## Adım 1: Git Kurulumu
1. [Git'i indir](https://git-scm.com/download/win)
2. Kurulumu tamamla
3. Terminal'i yeniden başlat

## Adım 2: GitHub Repository Oluştur
1. [GitHub.com](https://github.com)'a git
2. "New repository" → `balco`
3. Public olarak oluştur
4. README ekle seçeneğini işaretleme

## Adım 3: Projeyi Git'e Ekle
```bash
cd "C:\Users\sehir\Desktop\balco"
git init
git add .
git commit -m "Initial commit - BALCO production system"
git branch -M main
git remote add origin https://github.com/USERNAME/balco.git
git push -u origin main
```

## Adım 4: Vercel Deployment
1. [vercel.com](https://vercel.com)'a git
2. "Continue with GitHub" → GitHub ile giriş yap
3. "New Project" → `balco` repository'yi seç
4. Framework: Next.js (otomatik algılar)
5. Environment Variables ekle:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=super-secret-key-123456789
   MONGODB_URI=mock://localhost
   ```
6. "Deploy" butonuna bas

## Adım 5: Domain
Deployment tamamlandıktan sonra:
- `https://balco-xyz.vercel.app` gibi bir URL alacaksın
- İstersen custom domain ekleyebilirsin

## Troubleshooting
Eğer build hatası alırsan:
1. `npm run build` local'de çalışıyor mu kontrol et
2. Environment variables doğru mu kontrol et
3. Vercel loglarını incele

## Next Steps
- Analytics aktif et
- Custom domain ekle (isteğe bağlı)
- SSL otomatik aktif
- CDN otomatik aktif
