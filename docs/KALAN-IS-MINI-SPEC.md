# Kalan kart üretimi — mini spec

Son güncelleme: 2026-10-08

Bu belge, ilk içerik dalgasından sonra kalan kart üretiminin kapsamını ve teslim ölçütlerini sabitler. Kartlar `research/ → content/ → site/data/` akışında üretilir; her kart araştırma dosyasındaki bir iddiaya dayanır.

## Mevcut durum

| Ders | Hazır kart | Konu | Sonraki hedef |
| --- | ---: | ---: | ---: |
| PER141 | 510 | 18 | Bakım ve yeni doğrulama turu |
| PER207 | 102 | 7 | En az 450, hedef yaklaşık 500 |
| PER241 | 524 | 16 | Bakım ve yeni doğrulama turu |
| PER243 | 562 | 16 | Bakım ve yeni doğrulama turu |
| PER245 | 0 | 0 | En az 450, hedef yaklaşık 500 |
| PER247 | 0 | 0 | En az 450, hedef yaklaşık 500 |

Bu push ile 1.698 kartlık mevcut derlenmiş içerik korunur. Tüm dersler hedefe geldiğinde toplamın 3.000 kartı geçmesi beklenir.

## Kalan kapsam

1. PER207’nin 8–17 numaralı konularını tamamla; mevcut 102 karta en az 348 kart ekleyerek ders alt sınırını aş, yaklaşık 500 karta ulaş.
2. PER245 Yetişkin Perfüzyon I için araştırma başlıklarını konu dosyalarına dönüştür; her konuya terim, bilgi, flip, çoktan seçmeli, doğru/yanlış, unutma ve karşılaştırma kartları ekle.
3. PER247 Sterilizasyon ve Cerrahi Asepsi için aynı kart dağılımını ve kaynak izini uygula.
4. Her ders için `content/<DERS>/_dogrulama-a.md`, `-b.md`, `-c.md` kayıtlarını güncelle; kart numarası, kaynak, doğrulama notu ve yapılan düzeltme izlenebilir olsun.

## Teslim ölçütleri

- Her ders en az 450 karta ulaşır; pratik hedef yaklaşık 500 karttır.
- Kart türü dağılımı `docs/KART-YAZIM-SPEC.md` hedeflerine yakın tutulur: term %40, fact %18, mcq %15, flip %10, tf %8, remember %5, compare %4.
- Her kartta geçerli `source` bulunur; kart metni araştırma kaynağında desteklenir.
- Her konuda en az 15 kart bulunur; aynı soru veya cevabın kopyaları ve tek doğru cevabı olmayan testler temizlenir.
- Çoktan seçmeli kartlarda doğru seçenek konumları dengelenir; doğru/yanlış kartlarında iki yön dengesi korunur.
- `npm test` ve `npm run build:data` başarılı çalışır. Derleme sonunda `site/data/<DERS>.json` dosyaları güncellenir.
- Yeni ders tamamlandığında bağımsız içerik incelemesi ve son kaynak/çeldirici kontrolü doğrulama kaydına eklenir.

## Dosya ve teslim sırası

Her konu için `NN-konu-a.json`, `NN-konu-b.json`, `NN-konu-c.json` dosyaları kullanılır. Önce araştırma eşlemesi ve terim/bilgi kartları, sonra test kartları yazılır; ardından doğrulama kaydı güncellenir ve veri derlenir. Bir dersin tüm dosyaları tamamlanmadan `site/data/` çıktısı son ürün kabul edilmez.
