# Dünyanın en güzel perfüzyonisti: Tasarım Dokümanı

- **Tarih:** 2026-10-08
- **Durum:** Onaylandı (2026-10-08). Kullanıcı onay verirken görünümü pembe ve şirin tema olarak değiştirdi, bkz. bölüm 7.1.
- **Site adı:** Dünyanın en güzel perfüzyonisti

## 1. Amaç

İstanbul Gelişim Üniversitesi Sağlık Bilimleri Fakültesi Perfüzyon bölümünde okuyan bir 2. sınıf öğrencisi bu dönemin 6 dersine hazırlanacak. Öğrenci telefonda Instagram Reels kaydırır gibi kartları kaydıracak; terimleri, hap bilgileri ve sınavda çıkabilecek noktaları tekrar edecek. Uygulama, öğrencinin çıkmak istemeyeceği kadar akıcı olmalı; içerik ise doğru ve kapsamlı olmalı.

Kullanıcının özellikle vurguladıkları:

- Hocalar sınavda sık sık tek bir terimin ya da kelimenin anlamını soruyor. Bu yüzden terim kartları ağırlıkta olacak.
- İçerik gerçek bir web araştırmasına dayanacak.
- Bilgiler kesinlikle doğru olmalı ve çok önemli bilgilerin hepsi mutlaka yer almalı.
- Öğrenci uygulamadan çıkmak istememeli. Bunun için Gofrikli latte barı ile ödül verilecek.

## 2. Dersler

| Kod | Ders |
|---|---|
| PER141 | Perfüzyon Teknikleri Teknolojisi I |
| PER207 | Ekstrakorporeal Yaşam Desteği |
| PER241 | Konjenital ve Pediatrik Hastalarda Perfüzyon I |
| PER243 | Kardiyak Anestezi I |
| PER245 | Yetişkin Perfüzyon I |
| PER247 | Sterilizasyon ve Cerrahi Asepsi |

Ders programının ekran görüntüsü 10:00'dan başlıyor. Daha erken saatte ders varsa bu listeye eklenecek.

## 3. Kart türleri

| Tür (kod) | Ekrandaki adı | İçerik | Ne zaman "tamamlandı" sayılır |
|---|---|---|---|
| `term` | 📖 Terim | Terim, İngilizcesi, anlamı, gerekiyorsa kelime kökeni | Açık gösterimde 2 sn ekranda kalınca; gizli gösterimde dokununca |
| `fact` | 💊 Hap bilgi | Kısa başlık ve 1-3 cümle | 2 sn ekranda kalınca |
| `flip` | 🤔 Soru | Soru görünür, dokununca cevap açılır | Cevap açılınca |
| `mcq` | ✅ Test | Soru, 4 şık, doğru şık, kısa açıklama | Şık seçilince |
| `tf` | ⚖️ Doğru mu, yanlış mı? | İfade, doğru ya da yanlış olduğu, açıklama | Seçim yapılınca |
| `remember` | ⚠️ Bunu unutma! | Sınavda çok çıkan ya da hayati bilgi, ayrı renkte | 2 sn ekranda kalınca |
| `compare` | 🔀 Karıştırma! | Birbirine benzeyen iki kavram ve aralarındaki 2-4 fark | 2 sn ekranda kalınca |

Terim kartlarının yarısı açık gösterilir (terim ve anlamı birlikte). Diğer yarısı "Bu terim ne demek?" şeklinde gelir; anlam dokununca açılır, böylece öğrenci önce kendisi hatırlamaya çalışır.

**Hedef dağılım** (her ders için yaklaşık 500 kart; 2026-10-08'de kullanıcı isteğiyle 350'den yükseltildi): terim %40, hap bilgi %18, test %15, soru %10, doğru/yanlış %8, bunu unutma %5, karıştırma %4.

Her kartta ders kodu, ders adı ve konu yazar. Her kartın ayrıca 1-3 arası bir önem derecesi vardır (3 = sınavda çok çıkar ya da hayati).

## 4. Akış

- Kartlar tam ekran ve dikey dizilir. Bir kaydırma bir karta denk gelir (CSS scroll-snap).
- **Sıralama:** Seçili derslerin kartları rastgele karıştırılır. Karıştırma önem derecesine göre ağırlıklıdır, yani önemli kartlar turun başlarına daha sık düşer. Bir turda her kart bir kez gelir; tur bitince kartlar yeniden karıştırılır.
- Aynı türden en fazla 2 kart art arda gelir. Aynı konudan iki kartın art arda gelmemesine çalışılır.
- Yanlış cevaplanan test ve doğru/yanlış kartları 5-10 kart sonra yeniden gelir, en fazla 2 kez.
- **Filtre:** Tümü, tek bir ders ya da kaydedilen kartlar seçilebilir.
- **Kart düğmeleri:**
  - 🔖 Kaydet
  - ⚑ "Hatalı olabilir": kartı yerel bir listeye ekler. Bu liste ayarlar ekranından kopyalanıp gönderilebilir, böylece kart düzeltilir.
- **Performans:** Ekranda (DOM'da) aynı anda en fazla yaklaşık 30 kart tutulur. Geride kalan kartlar kaydırma konumu bozulmadan kaldırılır.
- Kaldığı kart ve filtre cihazda saklanır. Uygulama açılınca kaldığı yerden devam eder.

## 5. Gofrikli latte barı

- Ekranın en üstünde dolan bir latte bardağı simgesi, ilerleme çubuğu, "27/50" gibi bir sayaç ve kazanılan latte sayısı durur.
- **Puanlar (2026-10-08 kullanıcı değişikliği):** okunan her kart **+1**, doğru cevap **+2**, yanlış cevap **−1** puan. Akıştaki bir kart yalnızca bir kez puan verir; geri kaydırıp tekrar bakmak saymaz. Bar 0'ın altına inmez.
- Bar 50 puan olunca tam ekran kutlama çıkar: "Gofrikli latteyi kazandın! ☕". Latte sayısı 1 artar, artan puan yeni bara aktarılır (49 + 2 → latte ve 1 puan).
- Her puan değişiminde latte barının yanında kısa bir "+1 / +2 / −1" göstergesi belirir. Menüde toplam puan ve puan kuralları yazar.
- Küçük istatistikler gösterilir: bugün tamamlanan kart sayısı, toplam doğru ve yanlış sayısı.
- Bütün ilerleme cihazda (localStorage) saklanır. Kayıt yapılamazsa uygulama yine çalışır, yalnızca ilerleme saklanmaz.

## 6. İçerik üretimi ve doğruluk

1. **Araştırma:** Her ders ayrı ayrı web'de araştırılır.
   - Önce dersin gerçek içeriği bulunur: IGU ders bilgi paketi ya da başka üniversitelerdeki aynı adlı dersler. Sonra konu konu bilgi toplanır.
   - Kaynaklar: ders kitapları (Gravlee, Kaplan, Ghosh/Mora), kılavuzlar (EACTS/EACTA/EBCP KPB kılavuzu, ELSO, AmSECT, CDC, WHO, Sağlık Bakanlığı), hakemli makaleler, StatPearls ve Türkçe akademik kaynaklar.
   - Çıktı: `research/PERxxx.md`. Bu dosyada konu listesi, kaynaklı bilgiler, en az 120 terimlik sözlük, önemli sayısal değerler, kritik bilgiler ve sık karıştırılan kavramlar bulunur.
2. **Kart yazımı:** Kartlar araştırma dosyasından Türkçe olarak yazılır, kısa ve net tutulur. Yalnızca dosyada kaynağı olan bilgiler karta girer.
3. **Doğrulama:** Ayrı bir kontrol turunda her kart kaynaklarla karşılaştırılır. Yanlış olan düzeltilir, emin olunamayan silinir. Yapılan değişiklikler kayda geçer.
4. **Otomatik kontrol:** Şema, tekrar eden kartlar, şık sayısı ve doğru şık numarası, uzunluk sınırları otomatik denetlenir.

Kaynaklar farklı değerler veriyorsa en yaygın kabul gören değer ya da aralık yazılır, gerekiyorsa "kaynağa göre değişebilir" notu düşülür. Hocanın ders notu farklıysa hocanın notu geçerlidir.

**Uzunluk sınırları** (kartın telefon ekranına sığması için):

- Gövde metni en fazla yaklaşık 320 karakter
- Açıklama en fazla yaklaşık 240 karakter
- Test şıklarının her biri en fazla yaklaşık 90 karakter

## 7. Teknik yapı

- Statik bir site olacak: arayüz ve mantık `index.html` içinde, kartlar `data/` klasöründe her ders için ayrı bir JSON dosyasında.
- Framework ve harici kütüphane kullanılmaz. Saf HTML, CSS ve JS yazılır; dışarıdan yalnızca yazı tipleri (font) yüklenir.
- Telefon öncelikli tasarlanır ve iPhone Safari ile Android Chrome boyutlarında test edilir.

### 7.1 Görünüm: pembe ve şirin

Site bir kız öğrenci için yapılıyor; görünüm tatlı ve şirin olmalı.

- **Renkler:** pastel pembe, lila, krem; vurgu rengi canlı pembe.
  - Açık tema: pastel pembe zemin.
  - Koyu tema: yıldızlı gece (koyu mor-pembe zemin, parlayan yıldızlar).
- **Süslemeler:** Unicorn maskotu, yıldızlar, kalpler ve parıltılar. Görseller siteye gömülü SVG olarak çizilir, dışarıdan resim yüklenmez.
  - Arka planda hafifçe parıldayan yıldızlar olur. Telefonda "hareketi azalt" ayarı açıksa animasyonlar durur.
- **Biçim:** Yuvarlak köşeli, yumuşak gölgeli kartlar; Türkçe karakterleri destekleyen, yuvarlak hatlı bir yazı tipi.
- **Logo ve başlık:** "Dünyanın en güzel perfüzyonisti", yanında unicorn.
- **Latte barı:** Dolan latte bardağı şirin bir çizimle yapılır, üstünde pembe süslemeler olur.
  - 50 kartta çıkan kutlamada unicorn ve yıldız konfetisi olur.
- **Kart türü renkleri:** Her kart türünün kendi pastel rengi ve simgesi vardır. "Bunu unutma!" kartları en dikkat çekici renktedir.

Kart şeması (her türde ortak alanlar: `id`, `course`, `topic`, `type`, `importance`):

```json
{ "id": "PER245-0001", "course": "PER245", "topic": "Kardiyopleji", "type": "term", "importance": 3,
  "term": "Kardiyopleji", "en": "Cardioplegia",
  "definition": "Kalbi diyastolde durdurmak ve miyokardı korumak için koroner dolaşıma verilen solüsyon.",
  "origin": "kardia = kalp, plegia = felç" }

{ "type": "fact",     "title": "...", "body": "..." }
{ "type": "flip",     "question": "...", "answer": "..." }
{ "type": "mcq",      "question": "...", "options": ["...", "...", "...", "..."], "correct": 2, "explanation": "..." }
{ "type": "tf",       "statement": "...", "isTrue": false, "explanation": "..." }
{ "type": "remember", "title": "...", "body": "..." }
{ "type": "compare",  "left": { "title": "...", "points": ["..."] }, "right": { "title": "...", "points": ["..."] } }
```

Otomatik kontrol `scripts/validate.mjs` dosyasıyla Node üzerinde çalışır.

## 8. Paylaşım

- **Önizleme:** claude.ai Artifact linki.
- **Öğrenci için:** Herkese açık ücretsiz bir barındırma servisi (örneğin Netlify ya da GitHub Pages). Bu son adımdır ve yalnızca kullanıcının onayıyla yapılır.

## 9. Kapsam dışı (şimdilik)

Üyelik, sunucu, sıralama tablosu, bildirimler, ders notu yükleme ve çevrimiçi senkronizasyon.

## 10. Başarı ölçütleri

- 6 dersin her birinde en az 450, toplamda yaklaşık 3.000 kart var.
- Her kart doğrulama turundan geçmiş, otomatik kontrol hatasız.
- 7 kart türünün hepsi çalışıyor.
- Latte barı 50 puanda kutlama yapıyor ve uygulama kapatılıp açılınca ilerleme korunuyor.
- Telefonda kaydırırken takılma olmuyor ve her kartta ders ile konu görünüyor.
