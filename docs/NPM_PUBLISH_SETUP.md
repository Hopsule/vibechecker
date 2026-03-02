# npm Publish (CI) Kurulumu

## EOTP / 2FA hatası alıyorsan

Hesabında 2FA açıksa **Publish** veya **Classic** token OTP ister; CI’da OTP giremezsin.  
**Çözüm:** npm’de **Automation** tipi token kullan.

## Adımlar

1. **Token sayfası:** https://www.npmjs.com/settings/~/tokens  
2. **Generate New Token** → **Classic Token**  
3. **Token type:** **Automation** seç (Publish değil).  
4. **Generate** de, token’ı kopyala.  
5. GitHub’da secret’ı güncelle (aşağıda).

## GitHub secret güncelleme

Yeni token’ı GitHub’a yazmak için (terminalde):

```bash
cd vibechecker
echo "BURAYA_YENİ_AUTOMATION_TOKEN" | gh secret set NPM_TOKEN
```

Sonra Actions’tan **Publish to npm** workflow’unu **Re-run** et veya yeni bir release oluştur.

## Özet

| Token tipi   | CI’da publish | OTP gerekir? |
|-------------|----------------|--------------|
| Automation  | Evet           | Hayır        |
| Publish     | Hayır (EOTP)   | Evet         |
