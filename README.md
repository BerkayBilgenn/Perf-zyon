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

Altı derste **3.144 kart** bulunur: PER141 510, PER207 517, PER241 524, PER243 562, PER245 513, PER247 518. Kart üretimi ders başına en az 450, konu başına en az 15 ve tür dağılımı hedeflerine ulaştı. Kaynak izleri `content/<DERS>/_dogrulama-*.md` kayıtlarında; güncel kontrol kapsamı ve kalan geliştirmeler spec §13’te bulunur.

Kart üretimi ve yazar kontrolleri tamamlandı. PER207, PER245 ve PER247’nin bağımsız içerik taraması da tamamlandı: 28 kartın ifadesi, test adaleti veya kaynak atfı düzeltildi; toplam kart sayısı korundu. Her dersin `_bagimsiz-inceleme.md` dosyası dış kaynak doğrulamasının kapsamını ve erişim sınırlarını kaydeder.

## Devam turu doğrulaması

Belgelenen dokuz uygulama sorunu giderildi. Kaldığın kart yeniden puan vermez, cevaplar küçük ekranlarda görünür, ders yüklemeleri zaman aşımı ve şema kontrolüyle korunur. Mevcut 3.144 kimlik kaynak kartlara sabitlendi; içerik düzeltmeleri kaydedilenleri kaybettirmez. Başarısız derleme eski veriyi bırakmaz.

`npm test` 69 testi çalıştırır. Tarayıcı kontrolü için önizleme açıkken Playwright 1.62.1 ve Chromium/WebKit gerekir:

```bash
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium webkit
npm run test:browser
```

Önizleme yalnızca bu bilgisayarda `127.0.0.1` üzerinden dinler. `PLAYWRIGHT_MODULE` mevcut bir Playwright modülünün yoluna, `PREVIEW_URL` başka bir yerel önizleme adresine ayarlanabilir. GitHub Actions aynı kontrolleri otomatik çalıştırır.
