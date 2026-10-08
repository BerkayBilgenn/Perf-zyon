# Kalan kart üretimi — mini spec

Son güncelleme: 2026-10-08

Bu belge, ilk içerik dalgasından sonra kalan kart üretiminin kapsamını ve teslim ölçütlerini sabitler. Kartlar `research/ → content/ → site/data/` akışında üretilir; her kart araştırma dosyasındaki bir iddiaya dayanır.

## Güncel kart havuzu

| Ders | Kart | Konu |
| --- | ---: | ---: |
| PER141 | 510 | 18 |
| PER207 | 517 | 17 |
| PER241 | 524 | 16 |
| PER243 | 562 | 16 |
| PER245 | 513 | 18 |
| PER247 | 518 | 18 |

Toplam **3.144 kart** vardır. Altı dersin sayı/konu/tür hedefleri sağlanmıştır. PER207’nin bilgi ve soru türleri genişletildi; PER245 ve PER247’nin bütün konu dosyaları üretildi. Yeni üç dersin her kartı, ilgili `a/b/c` doğrulama kaydında dosya/sıra üzerinden araştırma ve kaynakla eşlenmiştir. Kaynaklara erişim sınırları ve yazar kontrolü ile bağımsız incelemenin kapsamı kayıtlarda ayrı belirtilir.

Kart üretimi ve yazar kontrolleri tamamlandı. PER207, PER245 ve PER247’nin bağımsız içerik taraması da tamamlandı: 28 kartın ifadesi, test adaleti veya kaynak atfı düzeltildi; toplam kart sayısı korundu. Her dersin `_bagimsiz-inceleme.md` dosyası dış kaynak doğrulamasının kapsamını ve erişim sınırlarını kaydeder.

## Bu devam turunun kapsamı

1. PER207’nin 17 konusunu bütün kart türleriyle genişletmek.
2. PER245 Yetişkin Perfüzyon I için 18 konuyu araştırmadan kartlara dönüştürmek.
3. PER247 Sterilizasyon ve Cerrahi Asepsi için 18 konuyu aynı kaynak izi ve dağılımla üretmek.
4. Kaynak, birim, soru adaleti ve tekrar sorunlarını düzeltmek; a/b/c kaynak kayıtlarını güncellemek.

Sonraki ürün geliştirmelerinin mevcut listesi `docs/KART-YAZIM-SPEC.md` §13’tedir.

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
