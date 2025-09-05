# Server Deployment Guide

## Uploads papkasini sozlash

### 1. Serverda uploads papkasini yaratish
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

### 2. Environment variables
Serverda quyidagi environment variables ni sozlang:
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SERVER_URL=https://nargile.uz
```

### 3. Vercel deployment uchun
- `vercel.json` fayli yaratilgan
- Uploads papkasi avtomatik yaratiladi
- File permissions avtomatik sozlanadi

### 4. Boshqa serverlar uchun
- Uploads papkasini manual yarating
- File permissions ni 755 qiling
- Server restart qiling

### 5. Test qilish
```bash
# Uploads papkasini tekshirish
ls -la public/uploads/

# Rasm URL'ini test qilish
curl -I https://nargile.uz/uploads/filename.jpg
```

## Xatoliklar

### Agar rasm ochilmasa:
1. Uploads papkasi mavjudligini tekshiring
2. File permissions ni tekshiring (755)
3. Server logs ni tekshiring
4. URL formatini tekshiring
