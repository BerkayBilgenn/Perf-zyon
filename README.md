# Dünyanın en güzel perfüzyonisti

Perfüzyon 2. sınıf dersleri için Instagram Reels gibi kaydırılan çalışma kartları: terim anlamları, hap bilgiler, testler ve "bunu unutma" uyarıları. Her 50 puanda bir Gofrikli latte kazanılır. ☕

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

## Vercel'de yayınlama

Repoyu Vercel'e aktarırken Root Directory alanını repo kökü olarak bırakın. Repodaki `vercel.json`, kart verilerini `npm run build:data` ile hazırlar ve `site/` klasörünü yayınlar. Böylece ana sayfa, stiller, JavaScript dosyaları ve kart verileri doğrudan site adresinden yüklenir. `npm run serve` yalnızca yerel önizleme içindir.

## Kart yazımı

Kartların nasıl yazılacağı, hedef sayılar (ders başına ~500, toplam 3.000+), doğrulama turu ve güncel durum: **[docs/KART-YAZIM-SPEC.md](docs/KART-YAZIM-SPEC.md)**

## Durum

Ara yayında dört derste **1.905 kart** bulunur: PER141 510, PER207 309, PER241 524, PER243 562. PER207’nin kalan kartları ile PER245 ve PER247’nin üretimi sürüyor. 57 test geçti; ders bazlı üretim ve doğrulama durumu spec §13 ve kalan iş mini spec’inde kayıtlıdır.
