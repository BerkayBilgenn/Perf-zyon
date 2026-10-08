# Dünyanın en güzel perfüzyonisti

Perfüzyon 2. sınıf dersleri için Instagram Reels gibi kaydırılan çalışma kartları: terim anlamları, hap bilgiler, testler ve "bunu unutma" uyarıları. Her 50 kartta bir Gofrikli latte kazanılır. ☕

- **Dersler:** PER141 Perfüzyon Teknikleri Teknolojisi I · PER207 Ekstrakorporeal Yaşam Desteği · PER241 Konjenital ve Pediatrik Hastalarda Perfüzyon I · PER243 Kardiyak Anestezi I · PER245 Yetişkin Perfüzyon I · PER247 Sterilizasyon ve Cerrahi Asepsi
- **Kart türleri:** terim, hap bilgi, soru (dokun, cevabı gör), test, doğru/yanlış, bunu unutma, karıştırma
- **İçerik akışı:** `research/` (kaynaklı araştırma dosyaları) → `content/` (konu konu kartlar) → `site/data/` (doğrulanıp derlenmiş kartlar)

## Çalıştırma

Bağımlılık yok, Node 20 veya üstü yeterli.

```bash
npm test            # testler
npm run build:data  # content/ → site/data/
npm run serve       # http://localhost:5173
```

## Durum

Site çalışıyor; kartların yazımı ve kaynaklarla doğrulanması sürüyor.
