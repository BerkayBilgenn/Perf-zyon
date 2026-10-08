# Kart Yazım ve Doğrulama Rehberi

> Bu belge kısa özettir. Ayrıntılı ve güncel kurallar `docs/KART-YAZIM-SPEC.md` dosyasındadır; çelişki olursa spec geçerlidir.

## 1. Okuyucu
İstanbul Gelişim Üniversitesi Perfüzyon (lisans) 2. sınıf öğrencisi. Kartlar sınav hazırlığı içindir ve telefonda Reels gibi tek tek okunur. Hocalar sınavda sık sık "X terimi ne demektir?" diye soruyor; terim kartları bu yüzden en kalabalık grup. Her kart kendi başına anlaşılır ve tek bir fikir taşır.

## 2. Doğruluk kuralları (en önemlisi)
1. Kartlara yalnızca `research/<DERS>.md` (ve varsa `research/<DERS>-2.md` gibi ek dosyalar) içinde kaynağı gösterilmiş bilgi girer.
2. Sayılar, dozlar, eşikler, sıcaklıklar, süreler ve sınıflamalar dosyadakiyle birebir aynı yazılır; birim her zaman yazılır.
3. Dosyada "(doğrulanamadı)" işaretli bilgi kullanılmaz.
4. Kaynaklar arasında fark varsa en yaygın kabul gören değer yazılır ve "genellikle", "yaygın kabul gören", "kılavuzlara göre" gibi bir ifadeyle yumuşatılır. Kesin olmayan şey kesinmiş gibi yazılmaz.
5. Merkezden merkeze değişen uygulamalar "merkeze göre değişebilir" diye belirtilir.
6. Emin değilsen kartı yazma.
7. `source` alanı: sayı, doz, eşik, sınıflama ya da kılavuz önerisi içeren her kartta kısa kaynak adı yazılır (örn. "EACTS/EACTA/EBCP 2024", "ELSO 2021", "CDC 2008", "WHO 2016", "StatPearls", "Gravlee"). En fazla 80 karakter, URL yok.

## 3. Biçim
Dosya: `content/<DERS>/NN-konu-slug-<harf>.json` — `a`: terim ve karşılaştırma, `b`: hap bilgi, soru, bunu unutma, `c`: test ve doğru/yanlış. `NN` ve slug sana verilen konu listesinden alınır.

```json
{
  "topic": "Antikoagülasyon",
  "cards": [
    { "type": "term", "importance": 3, "term": "Heparin direnci", "en": "Heparin resistance", "definition": "…", "source": "…" }
  ]
}
```

- `topic` sana verilen konu adıdır (en fazla 48 karakter), ekranda kartın üstünde görünür.
- Her kartta `type` ve `importance` zorunludur. `course` derlemede eklenir. Mevcut `id` alanı metin düzeltmelerinde korunur; yeni kartın ilk derlemede verilen kimliği kaynak dosyasına eklenir (spec §4.2).

| type | alanlar ve karakter sınırları |
|---|---|
| term | term ≤60 · en ≤80 (isteğe bağlı) · definition ≤320 · origin ≤120 (isteğe bağlı) |
| fact | title ≤70 · body ≤320 |
| remember | title ≤70 · body ≤320 |
| flip | question ≤200 · answer ≤320 |
| mcq | question ≤200 · options tam 4, her biri ≤90 · correct 0-3 · explanation ≤240 |
| tf | statement ≤220 · isTrue true/false · explanation ≤240 |
| compare | title ≤70 (isteğe bağlı) · left / right: { title ≤40, points 2-4 madde, her biri ≤90 } |

- Kalın yazı `**…**` ile, kart başına en fazla 1-3 anahtar kelime ya da sayı. İşaretler çift olmalı.
- Kontrol: `node scripts/build-data.mjs <DERS>` kendi dosyaların için hatasız olmalı.

## 4. Önem derecesi
- **3**: sınavda çok çıkar, temel tanım, hayati ya da güvenlik açısından kritik, sık karıştırılan.
- **2**: önemli ve sık kullanılan bilgi.
- **1**: destekleyici ayrıntı, tarihçe ayrıntısı.
- Kabaca %30 önem 3, %50 önem 2, %20 önem 1.

## 5. Türlere göre yazım
**term**
- Sözlükteki her önemli terim için bir kart. `definition`, "X terimi ne demektir?" sorusunun sınavda tam puan alacak cevabıdır.
- Tanım terimi tekrar etmeden başlar ("Kanın kristaloid veya kolloid sıvılarla seyreltilmesi."), 1-2 cümledir; gerekirse sonuna kısa bağlam eklenir.
- `origin` yalnızca kök gerçekten öğreticiyse ve doğruysa ("hemo = kan, dilüsyon = seyreltme").
- `en`: İngilizce karşılık; kısaltma varsa birlikte ("Activated clotting time (ACT)").
- Kartların yarısı "Bu terim ne demek?" diye gösterilir; `term` alanında açıklama olmaz.

**fact**
- `title` kısa ve bilgi verici ("Roller pompada oklüzyon"). `body` 1-3 cümle, tek fikir.

**remember**
- Yalnızca gerçekten kritik bilgiler: güvenlik kuralları, klasik sınav tuzakları, mutlaka ezberlenecek sayılar.

**flip**
- Sınavda sorulabilecek açık uçlu soru; `answer` kısa, net ve kendi başına anlaşılır.

**mcq**
- Tek doğru cevap; 3 çeldirici aynı kategoriden ve makul (örn. dört farklı kardiyopleji solüsyonu).
- "Hepsi", "Hiçbiri", "A ve B", "Yukarıdakilerin…" yasak: şıklar ekranda karıştırılır.
- Olumsuz soru ("hangisi … değildir?") az kullanılır ve olumsuz kelime kalın yazılır: `**değildir**`.
- Şıklar benzer uzunlukta olur; doğru şık hep en uzun olmasın. `correct` değerleri 0-3 arasında dengeli dağılsın.
- `explanation`: neden doğru; yer varsa en çekici çeldiricinin neden yanlış olduğu.

**tf**
- Yaklaşık yarısı doğru, yarısı yanlış.
- Yanlış ifade tek bir anahtar bilgi değiştirilerek kurulur ve kesinlikle yanlıştır; `explanation` doğrusunu söyler.
- "Her zaman", "asla" gibi kelimelerle tuzak kurma; bilgiyi sına.

**compare**
- Sık karıştırılan iki kavram (araştırma dosyasındaki "Sık karıştırılan kavramlar" bölümü).
- İki taraftaki maddeler aynı sırada aynı özelliği karşılaştırır (1. madde mekanizma, 2. madde kullanım alanı …).

## 6. Kapsam ve dağılım (ders başına ~500 kart, en az 450)
| tür | hedef |
|---|---|
| term | ~200 |
| fact | ~90 |
| mcq | ~75 |
| flip | ~50 |
| tf | ~40 |
| remember | ~25 |
| compare | ~20 |

- Araştırma dosyasındaki her konu kapsanır; konu başına kart sayısı konunun ağırlığıyla orantılıdır.
- "Kritik / sınavda çıkabilecek bilgiler" listesindeki her madde en az bir kartta yer alır (tercihen bir bilgi ve bir soru kartında).
- Aynı bilgi en fazla iki kez, farklı türlerde kullanılır; aynı soru iki kez yazılmaz.

## 7. Dil
- Doğru Türkçe tıp terimleri ve eksiksiz Türkçe karakterler (ı, İ, ş, ğ, ü, ö, ç).
- Kısaltmadan sonra kesme işareti: "KPB'de", "ACT'nin", "ECMO'da".
- Kısaltma ilk kullanıldığı kartta açılır ya da `en` alanında verilir.
- Hoca adı kullanılmaz; tarihçe kartlarında bilim insanı adları kullanılabilir.
- Hasta tedavisi tavsiyesi gibi değil, ders bilgisi gibi yazılır.

## 8. Doğrulama turu
Her kart için:
1. Bilgi araştırma dosyasıyla karşılaştırılır. Sayı, doz, eşik, sınıflama ya da şüpheli her iddia güvenilir bir web kaynağında (kılavuz, ders kitabı özeti, PubMed/PMC, StatPearls, resmî kurum) ayrıca doğrulanır.
2. Test kartında savunulabilir tek doğru cevap vardır; çeldiriciler kesin yanlıştır. Doğru/yanlış ifadesi tek anlamlıdır.
3. Ders kapsamına ve 2. sınıf düzeyine uygundur.
4. Türkçe anlaşılır, yazım hatası yok, terim doğru.
5. Yanlış olan düzeltilir; doğrulanamayan silinir. Her değişiklik `content/<DERS>/_dogrulama-<a|b>.md` dosyasına yazılır: dosya ve kart numarası, eski → yeni (ya da "silindi"), neden, kaynak URL.
6. Kritik bilgiler listesinde kartı olmayan madde varsa yeni kart eklenir ve aynı kayda yazılır.
7. Sonunda `node scripts/build-data.mjs <DERS>` hatasız çalışır.
