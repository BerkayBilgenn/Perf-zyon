# Kart Yazım Spec'i: Dünyanın en güzel perfüzyonisti

- **Sürüm:** 1.0 (2026-10-08)
- **Durum:** Yürürlükte. Kart yazımında bu belge esastır. `docs/content-guide.md` bunun kısa özetidir; ikisi çelişirse bu belge geçerlidir.
- **Okuyucu:** Bu projeyi devralan yapay zekâ ya da kişi. Belge kendi başına yeterli olacak şekilde yazıldı; önceki konuşmaları bilmen gerekmez.

## 0. Hızlı başlangıç

1. Bu belgeyi baştan sona oku.
2. `npm test` ve `npm run build:data` komutlarını çalıştır; ikisi de hatasız bitmeli (bkz. §12).
3. §13'teki durum tablosundan bir ders ve konu aralığı seç.
4. O dersin konu tablosunu (`docs/topics/<DERS>.md`) ve araştırma dosyasının ilgili bölümlerini oku.
5. Kartları konu konu yaz (§4-§9). Her dosyadan sonra `node scripts/build-data.mjs <DERS>` çalıştır.
6. Ders bitince doğrulama turunu yap (§10) ve tamamlanma ölçütlerini kontrol et (§11).

---

## 1. Proje ve kartların kullanıldığı yer

**Dünyanın en güzel perfüzyonisti**, İstanbul Gelişim Üniversitesi (İGÜ) Sağlık Bilimleri Fakültesi Perfüzyon (lisans) 2. sınıf öğrencisi için yapılmış, telefon öncelikli bir çalışma sitesidir.

- Öğrenci, kartları Instagram Reels gibi dikey kaydırır. Ekranda her seferinde tek bir kart vardır.
- Kartlar rastgele ama önem derecesine göre ağırlıklı sırayla gelir. Önemli kartlar daha sık ve daha önce gelir.
- Yanlış cevaplanan test kartları 5-10 kart sonra tekrar gelir.
- **Puanlar:** okunan her kart +1 (en az 2 saniye ekranda kalırsa), doğru cevap +2, yanlış cevap −1. Her 50 puanda bir "Gofrikli latte" kazanılır.
- Öğrenci kartları kaydedebilir ve hatalı gördüğü kartı "Hatalı olabilir" diye işaretleyebilir.

**Hocaların sınav tarzı:** sık sık "X terimi ne demektir?" diye sorarlar. Bu yüzden terim kartları en kalabalık gruptur ve terim tanımları sınavda tam puan alacak kalitede olmalıdır.

**Sitenin kartlarla ilgili davranışları** (yazarken bunları bil):

| Davranış | Kart yazımına etkisi |
|---|---|
| Terim kartlarının yarısı "Bu terim ne demek?" diye gizli gösterilir, anlam dokununca açılır | `term` alanı tek başına anlamlı olmalı ve açıklama içermemeli |
| Test şıkları ekranda her seferinde karıştırılır | "Hepsi", "Hiçbiri", "A ve B" gibi sıraya bağlı şıklar yasak; doğrulayıcı bunları reddeder |
| Kart telefon ekranına sığmalı (320×568'e kadar) | Karakter sınırları (§4.3) kesindir |
| `**kalın**` işareti ekranda pembe kalın yazı olur | Kart başına 1-3 anahtar kelime ya da sayı |
| `source` alanı kartın altında "Kaynak: …" diye görünür | Kısa ve okunur bir kaynak adı yaz; URL yazma |
| Kartın üstünde ders kodu, ders adı ve `topic` görünür | `topic` konu tablosundaki adla birebir aynı olmalı |

---

## 2. Hedef ve kapsam

- **Toplam hedef:** 3.000'den fazla kart. Ders başına ~500, en az 450.
- **Dersler** (6 ders, hepsi zorunlu kapsam):

| Kod | Ders | Konu sayısı | Araştırma dosyası |
|---|---|---|---|
| PER141 | Perfüzyon Teknikleri Teknolojisi I | 18 | `research/PER141.md` + `research/PER141-2.md` |
| PER207 | Ekstrakorporeal Yaşam Desteği | 17 | `research/PER207.md` + `research/PER207-2.md` |
| PER241 | Konjenital ve Pediatrik Hastalarda Perfüzyon I | 16 | `research/PER241.md` |
| PER243 | Kardiyak Anestezi I | 16 | `research/PER243.md` + `research/PER243-2.md` |
| PER245 | Yetişkin Perfüzyon I | 18 | `research/PER245.md` |
| PER247 | Sterilizasyon ve Cerrahi Asepsi | 18 | `research/PER247.md` + `research/PER247-2.md` |

- **Ders başına tür dağılımı** (~500 kart):

| Tür | Ekrandaki adı | Pay | Ders başına hedef |
|---|---|---|---|
| `term` | 📖 Terim | %40 | ~200 |
| `fact` | 💊 Hap bilgi | %18 | ~90 |
| `mcq` | ✅ Test | %15 | ~75 |
| `flip` | 🤔 Soru | %10 | ~50 |
| `tf` | ⚖️ Doğru mu, yanlış mı? | %8 | ~40 |
| `remember` | ⚠️ Bunu unutma! | %5 | ~25 |
| `compare` | 🔀 Karıştırma! | %4 | ~20 |

Derleme betiği, bir türün payı hedeften 5 puandan fazla saparsa uyarı verir. Ders bitince hiçbir dağılım uyarısı kalmamalıdır.

---

## 3. Bilgi kaynağı ve doğruluk kuralları

Bu bölüm spec'in en önemli kısmıdır. Yanlış bir kart, hiç olmayan karttan daha kötüdür.

### 3.1 Tek kaynak: araştırma dosyaları

Her dersin araştırma dosyası, İGÜ'nün resmî ders bilgi paketi (gbs.gelisim.edu.tr) esas alınarak web'de araştırılmış ve kaynaklandırılmıştır. Yapısı şöyledir:

| Bölüm | İçerik | Ne için kullanılır |
|---|---|---|
| 0 | Müfredat kaynağı (resmî haftalık konular) | Konuların ağırlığını anlamak |
| 1 | Konu listesi | Konu tablosunun kaynağı (`docs/topics/<DERS>.md`) |
| 2 | Konu konu bilgiler, her madde [Kx] etiketli | hap bilgi, soru, test, doğru/yanlış |
| 3 | Sözlük (Terim, İngilizce, Tanım, Köken, Kaynak) | terim kartları |
| 4 | Önemli sayısal değerler (+ 4.1 kaynakların uyuşmadığı değerler) | sayısal kartlar, hesap soruları |
| 5 | Kritik / sınavda çıkabilecek bilgiler | bunu unutma kartları, öncelikli sorular |
| 6 | Sık karıştırılan kavramlar | karıştırma kartları |
| 7 | Kaynaklar ([Kx] → başlık, URL) | `source` alanı, doğrulama |

**Kural:** Kartlara yalnızca bu dosyalarda kaynağı gösterilmiş bilgi girer. Kendi bilgine dayanarak kart yazma. Dosyada olmayan ama önemli olduğunu düşündüğün bir bilgi varsa önce doğrula (§10.2) ve araştırma dosyasına kaynaklı bir madde olarak ekle, sonra kartını yaz.

### 3.2 Değer ve ifade kuralları

1. Sayılar, dozlar, eşikler, sıcaklıklar, süreler ve sınıflamalar dosyadakiyle birebir aynı yazılır; birim her zaman yazılır.
2. "(doğrulanamadı)" işaretli bilgi kullanılmaz. [GK] ("genel kabul") işaretli bilgi kullanılabilir, ama "genellikle", "genel kabul gören" gibi bir ifadeyle yazılır, kesinmiş gibi sunulmaz.
3. **Kaynaklar uyuşmuyorsa** (Bölüm 4.1 ve metindeki notlar):
   - En yaygın kabul gören değeri yaz ve kaynağını belirt ("EACTS 2024'e göre …").
   - Ya da iki değeri birlikte ver ("kaynağa göre 300–400 IU/kg").
   - Bu değerleri **test ya da doğru/yanlış sorusu yapma**: hoca hangi kaynağı esas alıyorsa ona göre puanlanır, öğrenci haksız yere −1 almasın.
   - Türkiye'de Sağlık Bakanlığı (SKS) ile CDC/WHO farklıysa SKS değerini öne çıkar ve bunu belirt.
4. Merkezden merkeze değişen uygulamalar "merkeze göre değişebilir" diye belirtilir.
5. Emin değilsen kartı yazma.

### 3.3 `source` alanı

- Sayı, doz, eşik, sınıflama, tarih ya da kılavuz önerisi içeren **her** kartta zorunlu; diğerlerinde önerilir.
- [Kx] etiketinin Bölüm 7'deki kısa adını yaz: "EACTS/EACTAIC/EBCP 2024", "ELSO 2021", "CDC 2008", "WHO 2016", "AmSECT 2017", "Merck Manual", "BJA Education".
- En fazla 80 karakter; URL ve [Kx] etiketi yazılmaz.

---

## 4. Dosya düzeni ve veri şeması

### 4.1 Dosyalar

```
content/<DERS>/NN-slug-<harf>.json     ← kartları buraya yazarsın
docs/topics/<DERS>.md                  ← konu tablosu (NN, slug, topic)
research/<DERS>.md (+ -2.md)           ← tek bilgi kaynağı
site/data/<DERS>.json                  ← derleme çıktısı; elle düzenleme
```

- `NN` ve `slug` konu tablosundan alınır (örn. `03-ecmo-fizyolojisi`).
- Harf, dosyayı kimin yazdığını ve hangi türleri içerdiğini gösterir:
  - `a` → `term` ve `compare`
  - `b` → `fact`, `flip`, `remember` (PER207'nin mevcut `-b` dosyalarında `mcq` ve `tf` de var)
  - `c` → `mcq` ve `tf`
- Bir (ders, konu, harf) dosyasını aynı anda tek bir yazar yazar.
- Adı `_` ile başlayan dosyalar derlemeye girmez (doğrulama kayıtları için kullanılır).

### 4.2 Dosya biçimi

```json
{
  "topic": "ECMO fizyolojisi",
  "cards": [
    { "type": "term", "importance": 3, "term": "…", "definition": "…", "source": "…" }
  ]
}
```

- `topic` konu tablosundaki adla birebir aynıdır (en fazla 48 karakter).
- Her kartta `type` ve `importance` zorunludur.
- `id` ve `course` yazılmaz. Derleme, ders kodunu klasörden alır ve kartın ana metninden kalıcı bir kimlik üretir. Bu yüzden aynı kart iki kez yazılırsa derleme bunu "tekrarlanan kart" diye reddeder.
- Tanımlı olmayan bir alan yazılırsa derleme reddeder.

### 4.3 Türlere göre alanlar ve karakter sınırları

| type | Zorunlu alanlar | İsteğe bağlı alanlar |
|---|---|---|
| `term` | `term` ≤60 · `definition` ≤320 | `en` ≤80 · `origin` ≤120 · `source` ≤80 |
| `fact` | `title` ≤70 · `body` ≤320 | `source` |
| `remember` | `title` ≤70 · `body` ≤320 | `source` |
| `flip` | `question` ≤200 · `answer` ≤320 | `source` |
| `mcq` | `question` ≤200 · `options` tam 4 şık, her biri ≤90 · `correct` 0-3 · `explanation` ≤240 | `source` |
| `tf` | `statement` ≤220 · `isTrue` true/false · `explanation` ≤240 | `source` |
| `compare` | `left` ve `right`: { `title` ≤40, `points` 2-4 madde, her biri ≤90 } | `title` ≤70 · `source` |

Ortak alanlar: `type`, `importance` (1, 2 ya da 3), `topic` (dosyadan gelir; kart kendi `topic` alanıyla ezebilir ama yapma).

**Doğrulayıcının otomatik reddettiği durumlar:** sınırı aşan metin; boş alan; tek sayıda `**`; 4'ten farklı şık sayısı; aynı şıkkın iki kez yazılması; "Hepsi / Hiçbiri / Yukarıdaki… / A ve B" içeren şık; 0-3 dışında `correct`; true/false olmayan `isTrue`; 2-4 dışında madde sayısı; tanınmayan alan; tekrarlanan kart.

---

## 5. Kart türleri: kurallar ve örnekler

Örneklerde `source` alanı kısalık için bazen yazılmadı; gerçek kartlarda §3.3 geçerlidir. Örneklerin hepsi doğrulayıcıdan geçer.

### 5.1 `term` · 📖 Terim

**Amaç:** "X terimi ne demektir?" sorusuna sınavda tam puan alacak cevap.

- `definition` terimi tekrar etmeden başlar ("Kanın … seyreltilmesi."), 1-2 cümledir; gerekirse sonuna kısa bağlam eklenir ("KPB'de … nedeniyle olur.").
- `term` yalnızca terimin kendisidir. Parantez içinde açıklama yazılmaz, çünkü kart gizli gösterildiğinde cevabı ele verir. Kısaltma varsa `en` alanında verilir.
- `en`: İngilizce karşılık; kısaltmayla birlikte ("Activated clotting time (ACT)").
- `origin`: yalnızca kök gerçekten öğreticiyse ve araştırma dosyasında varsa ("hemo = kan, dilüsyon = seyreltme").
- Sözlükteki hemen her terim bir kart olur (§7).

İyi:
```json
{ "type": "term", "importance": 3, "term": "Kardiyopleji", "en": "Cardioplegia",
  "definition": "Kalp cerrahisi sırasında kalbi **diyastolde durdurmak** ve miyokardı korumak için koroner dolaşıma verilen, genellikle potasyumdan zengin solüsyon.",
  "origin": "kardia = kalp, plegia = felç" }
```

Kötü:
- `"term": "Kardiyopleji (kalbi durduran solüsyon)"` → gizli gösterimde cevabı söyler.
- `"definition": "Kardiyopleji, kardiyopleji solüsyonunun verilmesidir."` → terimi tekrar ediyor, bilgi vermiyor.

### 5.2 `fact` · 💊 Hap bilgi

**Amaç:** tek bir bilgiyi akılda kalıcı biçimde vermek.

- `title` kısa ve bilgi verici olur ("Roller pompada oklüzyon", "ACT nedir?"). "Önemli bilgi" gibi boş başlıklar kullanılmaz.
- `body` 1-3 cümledir ve tek fikir taşır.

İyi:
```json
{ "type": "fact", "importance": 2, "title": "ACT nedir?",
  "body": "**ACT** (aktive pıhtılaşma zamanı), heparin etkisini ameliyathanede hızlıca izlemek için kullanılan yatak başı testidir." }
```

Kötü: Tek kartta ACT'nin tanımı, heparin dozu ve protamin oranı birlikte anlatılırsa üç ayrı karta bölünmelidir.

### 5.3 `remember` · ⚠️ Bunu unutma!

**Amaç:** sınavda çok çıkan, sık karıştırılan ya da hasta güvenliği açısından hayati bilgiler. Ekranda en dikkat çekici kart budur, bu yüzden az kullanılır (ders başına ~25).

- Kaynağı araştırma dosyasındaki "Kritik bilgiler" bölümüdür.

İyi:
```json
{ "type": "remember", "importance": 3, "title": "FDA onaylı ilk TAH",
  "body": "SynCardia (eski adı CardioWest) geçici total yapay kalp, **Ekim 2004**'te biventriküler yetmezlikte transplantasyona köprü olarak FDA onayı alan ilk yapay kalp oldu.",
  "source": "NEJM 2004 (Copeland)" }
```

### 5.4 `flip` · 🤔 Soru

**Amaç:** açık uçlu hatırlama. Öğrenci önce kendi cevaplar, sonra dokunup cevabı görür.

- Soru "ne, neden, nasıl, hangi" ile sorulur. Evet/hayır sorusu yazılmaz.
- `answer` kısa, net ve kendi başına anlaşılır olur.

İyi:
```json
{ "type": "flip", "importance": 3, "question": "Total yapay kalbin başlıca endikasyonu nedir?",
  "answer": "Yakın ölüm riski taşıyan **ciddi biventriküler yetmezlikte** transplantasyona köprü (BTT).",
  "source": "TAH derlemesi, PMC 2023" }
```

Kötü: `"question": "Protamin önemli midir?"` → evet/hayır sorusu, bilgi ölçmüyor.

### 5.5 `mcq` · ✅ Test

**Amaç:** sınav tarzı çoktan seçmeli soru. Doğru cevap +2, yanlış cevap −1 puan verir; bu yüzden soru adil olmalıdır.

- **Tek** savunulabilir doğru cevap vardır. Çeldiriciler kesin yanlıştır ve aynı kategoridendir (örn. dört farklı pompa türü, dört farklı ilaç).
- Şıklar ekranda karıştırılır. "Hepsi", "Hiçbiri", "A ve B", "Yukarıdakilerin…" yazılmaz.
- Şıklar benzer uzunlukta olur. Doğru şık hep en uzun ya da en ayrıntılı olmasın.
- `correct` değerleri 0-3 arasında dengeli dağılsın; hep 0 olmasın.
- Olumsuz soru ("hangisi … değildir?") az kullanılır ve olumsuz kelime kalın yazılır: `**değildir**`.
- `explanation` doğru cevabın nedenini söyler; yer varsa en çekici çeldiricinin neden yanlış olduğunu da.
- Kaynakların uyuşmadığı değerler soru yapılmaz (§3.2).
- **Hesap soruları** (VYA, kardiyak indeks, pompa akımı, kan hacmi, dilüsyonel Hct, heparin ya da protamin dozu): yalnızca araştırma dosyasında formülü ve değerleri kesin olanlarla yazılır. Hesap iki kez kontrol edilir; çeldiriciler tipik hesap hatalarından türetilir.

İyi:
```json
{ "type": "mcq", "importance": 3,
  "question": "Total yapay kalbi (TAH) LVAD'den ayıran temel özellik hangisidir?",
  "options": ["Her iki ventrikülü çıkarıp yerini alması", "Yalnızca sol ventrikülü desteklemesi", "Perkütan yolla yerleştirilmesi", "Diyastolde aortta şişip sistolde sönmesi"],
  "correct": 0,
  "explanation": "TAH ventrikülleri ve kapakları çıkarıp yerine geçer; LVAD nativ kalbi yerinde bırakır. Diyastolde şişip sistolde sönen cihaz İABP'dir.",
  "source": "TAH derlemesi, PMC 2023" }
```

İyi (hesap):
```json
{ "type": "mcq", "importance": 2,
  "question": "VYA'sı 1,8 m² olan hastada kardiyak indeks 2,4 L/dk/m² alınırsa hedef pompa akımı yaklaşık kaçtır?",
  "options": ["4,3 L/dk", "3,6 L/dk", "5,0 L/dk", "2,4 L/dk"],
  "correct": 0,
  "explanation": "Pompa akımı = VYA × kardiyak indeks = 1,8 × 2,4 ≈ 4,3 L/dk. 2,4 L/dk yalnızca indeksin kendisidir." }
```

Kötü:
- `"options": ["Heparin", "Protamin", "Hepsi", "Hiçbiri"]` → sıraya bağlı şık; doğrulayıcı reddeder.
- İki şık da savunulabilir ("En sık komplikasyon hangisidir?" sorusuna kaynaklar farklı cevap veriyorsa).
- Çeldiriciler farklı kategoriden ("Heparin", "Mavi", "Sol ventrikül", "5 dakika") → soru çok kolaylaşır.

### 5.6 `tf` · ⚖️ Doğru mu, yanlış mı?

- Ders başına yaklaşık yarısı doğru, yarısı yanlış ifade olur.
- Yanlış ifade, **tek bir anahtar bilgi** değiştirilerek kurulur ve kesinlikle yanlıştır. `explanation` doğrusunu söyler.
- "Her zaman", "asla" gibi kelimelerle tuzak kurulmaz; bilgi sınanır.
- Tek anlamlı olmalıdır: bir uzman "duruma göre değişir" diyebiliyorsa kart yazılmaz.

İyi (yanlış ifade):
```json
{ "type": "tf", "importance": 2,
  "statement": "Roller pompada aynı devirde ard yük (direnç) artarsa akım belirgin şekilde azalır.",
  "isTrue": false,
  "explanation": "Roller pompa ard yükten büyük ölçüde bağımsızdır; direnç artınca akım değil hat basıncı yükselir. Akımı ard yükle düşen pompa santrifügal pompadır." }
```

Kötü: `"statement": "Heparin her zaman 300 IU/kg verilir."` → hem mutlak kelimeyle tuzak kuruyor hem de kaynaklara göre değişen bir doz.

### 5.7 `compare` · 🔀 Karıştırma!

**Amaç:** sık karıştırılan iki kavramı yan yana göstermek. Kaynağı araştırma dosyasının "Sık karıştırılan kavramlar" bölümüdür.

- İki taraftaki maddeler **aynı sırada aynı özelliği** karşılaştırır (1. madde çalışma ilkesi, 2. madde akımı belirleyen etken …).
- Her taraf 2-4 madde; maddeler kısa ifade (tam cümle şart değil).

İyi:
```json
{ "type": "compare", "importance": 2, "title": "Pompa türleri",
  "left": { "title": "Roller pompa", "points": ["Oklüzif çalışır, tüpü sıkıştırarak kanı iter", "Akım; devir ve tüp çapıyla belirlenir"] },
  "right": { "title": "Santrifügal pompa", "points": ["Oklüzif değildir, dönen çark ile çalışır", "Akım ön ve ard yüke bağlıdır, akım ölçer gerekir"] } }
```

---

## 6. Önem derecesi (`importance`)

| Değer | Ne zaman | Yaklaşık pay |
|---|---|---|
| 3 | Sınavda çok çıkar, temel tanım, hayati ya da güvenlik açısından kritik, sık karıştırılan | %30 |
| 2 | Önemli ve sık kullanılan bilgi | %50 |
| 1 | Destekleyici ayrıntı, tarihçe ayrıntısı, ilginç bilgi | %20 |

Önem 3 olan kartlar akışta daha sık ve daha önce gelir; her kartı 3 yapmak bu ağırlığı bozar.

---

## 7. Kapsam kuralları

1. **Konular:** Konu tablosundaki her konu kapsanır. Kart sayısı konunun ağırlığıyla orantılıdır: resmî haftalık konular (araştırma dosyası Bölüm 0) daha ağırdır. Her konuda en az ~15, büyük konularda 30-50 kart olur.
2. **Sözlük:** Bölüm 3'teki terimlerin hemen hepsi (önemsiz ya da doğrulanamamış olanlar hariç) birer terim kartı olur. Bu, ders başına ~200 terim kartı demektir.
3. **Kritik bilgiler:** Bölüm 5'teki her madde en az bir kartta yer alır; tercihen biri bilgi ya da "bunu unutma", biri soru ya da test olmak üzere iki kartta.
4. **Sayısal değerler:** Bölüm 4'teki her önemli satır en az bir kartta yer alır. Bölüm 4.1'deki uyuşmayan değerler için §3.2 geçerlidir.
5. **Sık karıştırılanlar:** Bölüm 6'daki çiftlerin en önemli ~20'si karşılaştırma kartı olur.
6. **Tekrar:** Aynı bilgi en fazla iki kez, farklı türlerde kullanılır (örn. bir hap bilgi ve bir test). Aynı soru iki kez yazılmaz. Yeni bir kart yazmadan önce aynı ders klasöründe ara (`grep -ri "<anahtar kelime>" content/<DERS>/`).
7. **Dersler arası örtüşme:** Bazı konular birden fazla derste geçer (anatomi PER241 ve PER245'te; kardiyopleji PER141 ve PER245'te; ECMO PER207 ve PER241'de). Bu serbesttir, ama kart o dersin açısından yazılır ve başka dersten birebir kopyalanmaz.

---

## 8. Türkçe yazım kuralları

- Doğru Türkçe tıp terimleri ve eksiksiz Türkçe karakterler kullanılır (ı, İ, ş, ğ, ü, ö, ç).
- Başlıklarda yalnızca ilk kelime büyük harfle başlar; büyük harfle yazılmış başlık kullanılmaz.
- Kısaltmalardan sonra kesme işareti konur: KPB'de, ACT'nin, ECMO'da, İABP'ye.
- **Sayılar:**
  - Ondalık için virgül (2,4); aralık için kısa çizgi (2,2–2,4); binlik ayırıcı olarak nokta (2.000).
  - Yüzde işareti sayıdan önce gelir (%40).
  - Birim sayıdan bir boşlukla ayrılır: 480 sn, 37 °C, 2,4 L/dk/m², 300 IU/kg, 60 mmHg.
- Kısaltma, kartta ilk geçtiği yerde açılır ya da `en` alanında verilir.
- Dil açık, sınav dilinde ve sade olur. Kart metnine emoji konmaz; arayüz kendi simgelerini ekler.
- Hoca adı ve hasta bilgisi yazılmaz. Tarihçe kartlarında bilim insanı adları kullanılabilir.
- Kartlar ders bilgisi olarak yazılır, hasta tedavisi tavsiyesi olarak değil.

---

## 9. Üretim akışı

### 9.1 Tek yazar

1. Bir iş birimi seç: (ders, konu aralığı, harf). Örneğin "PER245, konular 01–09, harf `a`".
2. `docs/topics/<DERS>.md` dosyasını ve araştırma dosyasının yalnızca o konulara ait kısımlarını oku. Bölüm 3-6'da senin konularına düşen satırları da oku.
   - Dosyalar büyüktür (60-175 KB). Hepsini birden okuma; bölüm bölüm, konu konu oku.
3. Her konu için:
   1. Kapsanacak bilgileri listele: sözlük terimleri, kritik maddeler, sayılar, karıştırılan çiftler.
   2. Aynı ders klasöründe benzer kart var mı diye ara.
   3. Dosyayı yaz (10-40 kart).
   4. `node scripts/build-data.mjs <DERS>` çalıştır ve kendi dosyandaki hataları düzelt.
4. Bütün konular bitince derleme çıktısındaki tür dağılımına bak; eksik türleri tamamla.
5. Doğrulama turuna geç (§10).

### 9.2 Birden çok yazarla paralel üretim (isteğe bağlı)

- Her yazar tek bir (ders, konu aralığı, harf) iş birimine sahip olur. İki yazar aynı dosyaya yazmaz.
- Önerilen bölme: her ders için 2 konu yarısı × 3 harf = 6 yazar. Bir yazarın konu yarısı için hedefleri:
  - `a` (terim ve karşılaştırma): term ~100, compare ~10
  - `b` (hap bilgi, soru, bunu unutma): fact ~45, flip ~25, remember ~12
  - `c` (test, doğru/yanlış): mcq ~38, tf ~20
- Yazarlara verilecek ortak talimat `docs/writer-brief.md` dosyasındadır. Talimata ders, konu aralığı, harf ve hedef sayıları ekle.
- PER207'de konular 01–06 için `-b` dosyaları zaten mcq ve tf de içeriyor. Bu konularda çalışacak `c` yazarı önce mevcut sayıları kontrol etmeli ve yalnızca eksik kalanı eklemelidir.
- Web arama kotası sınırlı olabilir. Yazarlar web'de arama yapmaz; doğrulayıcılar kaynak URL'lerini doğrudan açar (§10.2).

---

## 10. Doğrulama turu

Her kart, yazarından **farklı** bir yapay zekâ ya da kişi tarafından doğrulanır.

### 10.1 Her kart için kontrol listesi

1. **Doğruluk:** Bilgi araştırma dosyasıyla uyumlu mu?
2. **Sayılar:** Her sayı, doz, eşik, sıcaklık, süre ve sınıflama güvenilir bir kaynakta ayrıca doğrulandı mı (§10.2)?
3. **Adalet:** Testte tek bir savunulabilir doğru cevap var mı, çeldiriciler kesin yanlış mı? Doğru/yanlış ifadesi tek anlamlı mı? Kaynakların ayrıştığı bir değer soru yapılmış mı?
4. **Dil:** Türkçe anlaşılır mı, yazım hatası var mı, terim doğru mu, §8'e uyuyor mu?
5. **Kapsam:** Ders kapsamına ve 2. sınıf düzeyine uygun mu?
6. **Biçim:** Terim alanında açıklama var mı? Kalın yazı abartılmış mı? `source` gerekiyorsa var mı?

### 10.2 Nasıl doğrulanır

- Önce araştırma dosyasındaki [Kx] kaynağının URL'sini aç (Bölüm 7) ve iddiayı orada bul.
- Bulamazsan güvenilir bir kaynağa bak: uluslararası kılavuzlar (EACTS/EACTAIC/EBCP, ELSO, AmSECT, CDC, WHO), T.C. Sağlık Bakanlığı, PubMed/PMC makaleleri, ders kitabı özetleri, Merck Manual.
- Forum, blog ve reklam sitelerine dayanma.
- **Şüphede kalırsan kartı sil.**

### 10.3 Ne yapılır, nasıl kaydedilir

- Yanlış olan düzeltilir; doğrulanamayan silinir; kritik bilgilerden kartı olmayan varsa eklenir.
- Her değişiklik `content/<DERS>/_dogrulama-<harf>.md` dosyasına yazılır:

```markdown
## 03-ecmo-fizyolojisi-b.json
- #7 düzeltildi: "sweep gaz akımı oksijenlenmeyi belirler" → "sweep gaz akımı CO2 atılımını belirler" — neden: kaynakta tersi yazıyor — kaynak: https://…
- #12 silindi: iddia kaynakta bulunamadı.
- eklendi: "Harlequin sendromu" kritik maddesi için remember kartı — kaynak: https://…
```

- Doğrulamadan sonra `node scripts/build-data.mjs <DERS>` hatasız çalışmalı ve ders yine en az 450 kart olmalıdır. Silmeler yüzünden altına düştüyse eksik konulardan yeni kart yazılır ve onlar da doğrulanır.

---

## 11. Tamamlanma ölçütleri

**Her kart için kısa kontrol:** tek fikir · kaynakta var · sayılar doğrulandı · tek doğru cevap · sınırların içinde · Türkçe temiz · `source` var (gerekiyorsa).

**Bir ders "bitti" sayılır, eğer:**
- [ ] En az 450 kart var (hedef ~500).
- [ ] `node scripts/build-data.mjs <DERS>` hatasız ve dağılım uyarısı yok.
- [ ] Her konuda en az ~15 kart var.
- [ ] Kritik bilgilerin her biri en az bir kartta.
- [ ] Bütün dosyaların doğrulama kaydı (`_dogrulama-*.md`) var.

**Proje "bitti" sayılır, eğer:**
- [ ] 6 dersin hepsi bitti; toplam 3.000'den fazla kart var.
- [ ] `npm test` yeşil.
- [ ] Duman testi yapıldı: `npm run serve` ile siteyi aç, her dersi filtreden seç, en az 20 kart kaydır, 5 test cevapla. Konsolda hata olmamalı.
- [ ] Son hâl GitHub reposuna gönderildi (§13).

---

## 12. Komutlar

Bağımlılık yok; Node 20 veya üstü yeterli. Komutlar proje kök klasöründe çalıştırılır.

```bash
npm test                              # tüm testler (şema, derleme, akış, puan …)
node scripts/build-data.mjs PER245    # tek dersi doğrula ve derle
npm run build:data                    # bütün dersleri derle → site/data/
npm run serve                         # siteyi aç: http://localhost:5173
node scripts/build-artifact.mjs       # claude.ai Artifact sürümü → dist/artifact.html
```

Derleme çıktısı örneği:

```
✓ PER207: 102 kart  term:2 fact:35 flip:17 mcq:25 tf:15 remember:7 compare:1 | önem 3:27 2:55 1:20 | 7 konu
  ! toplam 102 kart (en az 450 olmalı)
  ! term: %2 (hedef %40)
```

---

## 13. Mevcut durum ve devir notları (2026-10-08)

| Ders | Araştırma | Kart | Durum |
|---|---|---|---|
| PER141 | kaynaklı araştırma hazır | 510 | 18 konu üretildi; doğrulama kayıtları mevcut |
| PER207 | kaynaklı araştırma hazır | 309 | 17 konuda terimler üretildi; diğer türler ve bağımsız son inceleme sürüyor |
| PER241 | kaynaklı araştırma hazır | 524 | 16 konu üretildi; doğrulama kayıtları mevcut |
| PER243 | kaynaklı araştırma hazır | 562 | 16 konu üretildi; doğrulama kayıtları mevcut |
| PER245 | kaynaklı araştırma hazır | 0 | Kart üretimi sürüyor; bu ara yayına alınmadı |
| PER247 | kaynaklı araştırma hazır | 0 | Kart üretimi sürüyor; bu ara yayına alınmadı |

Ara yayın toplamı **1.905 karttır**. Henüz derslerin tamamlanma ölçütleri sağlanmamıştır; güncel kalan kapsam `docs/KALAN-IS-MINI-SPEC.md` dosyasındadır.

**Hazır olanlar:**
- Site kodu tamam ve test edildi (57 test). Kapsadığı özellikler:
  - kaydırmalı akış ve 7 kart türü
  - puan sistemi ve Gofrikli latte kutlaması
  - ders filtresi ve kaydedilenler
  - "Hatalı olabilir" listesi
  - açık ve koyu tema
- Altı dersin araştırma dosyaları tamam. Hepsi İGÜ'nün resmî ders sayfalarındaki haftalık konulara dayanıyor.

**Site kodunda bilinen küçük sorunlar** (bağımsız kod incelemesinden; içerik işini etkilemez, ama derleme kuralı için 9. maddeye dikkat):

1. Kaldığın kart, uygulama her açıldığında yeniden puan veriyor (aynı test tekrar cevaplanırsa +2).
2. 320 px genişlikte bir ders seçiliyken üst barda "27/50" ile latte rozeti çakışıyor.
3. Uzun bir kartta "Cevabı gör" sonrası cevap görünür alanın altında kalabiliyor.
4. Bir ders dosyası hiç cevap vermezse yükleme ekranı takılı kalıyor (zaman aşımı yok).
5. Elle bozulmuş kart verisi slaytları boş bırakabiliyor (yüklemede türe göre doğrulama yok).
6. Artifact sürümünde `lang="tr"` düşüyor.
7. Hap bilgi ya da doğru/yanlış kartının metni düzeltilince kartın kimliği değişiyor; öğrencinin kaydettikleri ve işaretleri o kart için kaybolur.
8. Koyu temada telefonun tarayıcı çubuğu pembe kalıyor.
9. Bir dersin derlemesi hata verirse eski `site/data/<DERS>.json` dosyası sessizce kalır. **Yayından önce bütün derslerin hatasız derlendiğini kontrol et.**

Kaydırma WebKit'te (iPhone Safari'nin motoru) masaüstünde doğrulandı. Gerçek bir iPhone'da 20 kart kaydırarak ayrıca denenmesi önerilir.

**İlgili belgeler:**
- Tasarım: `docs/superpowers/specs/2026-10-08-perfuzyon-reels-design.md`
- Uygulama planı: `docs/superpowers/plans/2026-10-08-perfuzyon-reels.md`
- Kısa rehber: `docs/content-guide.md`
- Yazar talimatı: `docs/writer-brief.md`
- Konu tabloları: `docs/topics/`

**Repo ve gönderme:**
- Repo: https://github.com/BerkayBilgenn/Perf-zyon (`main` dalı).
- Gönderme BerkayBilgenn GitHub hesabıyla yapılır.
- Repo herkese açık olduğu için commit e-postası olarak GitHub'ın gizli adresi kullanılır: `131668510+BerkayBilgenn@users.noreply.github.com`. Kişisel ya da iş e-postası kullanma.

---

## 14. "Hatalı olabilir" bildirimlerini düzeltme

Öğrenci menüden şu biçimde bir liste kopyalar:

```
“Hatalı olabilir” dediğim kartlar:
- PER207 · Total yapay kalbin başlıca endikasyonu nedir? [PER207-1qt1kxl]
```

Her satır için:
1. Kart metnini kullanarak kaynak dosyayı bul: `grep -rn "Total yapay kalbin başlıca" content/PER207/`.
2. Kartı §10'a göre doğrula; düzelt ya da sil.
3. Değişikliği `_dogrulama-*.md` dosyasına yaz.
4. Dersi yeniden derle.

Kimlik kartın ana metninden üretildiği için ana metin değişirse kartın kimliği de değişir; bu beklenen bir davranıştır.

---

## 15. Değişiklik geçmişi

- **1.0 (2026-10-08):** İlk sürüm.
  - Hedef ders başına ~500 kart ve toplam 3.000'den fazla.
  - Puan sistemi: kart +1, doğru +2, yanlış −1.
  - Harf kuralı: a, b, c.
