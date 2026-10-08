# PER247 bağımsız içerik incelemesi

Tarih: 2026-10-08. İnceleyen: kart yazımından ayrı inceleme ajanı (`review_per247`). Bu kayıt, `_dogrulama-a/b/c.md` içindeki yazar kontrollerinden ayrı bir incelemedir.

## Kapsam ve yöntem

`docs/KART-YAZIM-SPEC.md` §3 ve §10, `docs/topics/PER247.md`, `research/PER247.md`, `research/PER247-2.md` ve üç yazar doğrulama kaydı esas alındı. Aşağıdaki **54 JSON dosyasındaki 518 kartın tamamının** bilgi taşıyan alanları okundu; araştırma notlarındaki konu/kaynak izleriyle karşılaştırıldı. 75 çoktan seçmeli sorunun kökü, dört şıkkı, doğru indeksi ve açıklaması; 40 doğru/yanlış kartının önermesi, cevabı ve açıklaması ayrıca değerlendirildi. Terimlerin İngilizce karşılıkları ve kartların tek başına anlaşılması da incelendi.

Sayısal değerler, birimler, sterilizasyon çevrimlerinin koşulları, enfeksiyon önlemleri ve perfüzyon riskleri için aşağıda belirtilen dış kaynak bölümleri açılarak kontrol edildi. Bu, her kartın dış kaynağının ayrı ayrı yeniden açıldığı veya tüm kaynakların güncel uygulama açısından onaylandığı anlamına gelmez. Erişilemeyen kaynaklar ve kapsam sınırları aşağıda açıkça ayrılmıştır.

Tablodaki dosya gövdesinin `-a.json`, `-b.json`, `-c.json` dosyalarının **bütün kartları** kapsam içindedir. Kart sıra numaraları dosyanın `cards` dizisinde 1'den başlar.

| Dosya gövdesi | a | b | c | Toplam |
|---|---:|---:|---:|---:|
| 01-temel-kavramlar | 24 | 10 | 6 | 40 |
| 02-asepsi-antisepsi | 12 | 9 | 6 | 27 |
| 03-spaulding | 10 | 9 | 7 | 26 |
| 04-dezenfektanlar | 21 | 10 | 8 | 39 |
| 05-msu | 8 | 9 | 6 | 23 |
| 06-temizlik | 13 | 9 | 6 | 28 |
| 07-buhar-kuru-isi | 19 | 10 | 7 | 36 |
| 08-dusuk-sicaklik | 17 | 10 | 6 | 33 |
| 09-testler-indikatorler | 28 | 10 | 8 | 46 |
| 10-alet-setleri | 10 | 9 | 6 | 25 |
| 11-isiya-duyarli | 3 | 9 | 6 | 18 |
| 12-depolama | 6 | 9 | 6 | 21 |
| 13-ameliyathane | 11 | 9 | 6 | 26 |
| 14-el-antisepsisi | 12 | 10 | 6 | 28 |
| 15-cae-profilaksi | 17 | 8 | 6 | 31 |
| 16-el-hijyeni-atik | 19 | 8 | 7 | 34 |
| 17-perfuzyon | 4 | 9 | 6 | 19 |
| 18-prionlar | 4 | 8 | 6 | 18 |
| **Toplam** | **238** | **165** | **115** | **518** |

## Düzeltilen bulgular

Altı kartta, beş dosyada düzeltme yapıldı. Kart eklenmedi, silinmedi veya yeniden sıralanmadı; `correct`, kart tipi, önem ve kaynak alanları değiştirilmedi.

| Kart | Bulgusu ve düzeltme | Dayanak |
|---|---|---|
| `03-spaulding-c.json` #4 | “Vejetatif bakterilerden daha dirençli” kökü hem mantarları hem sporları doğru kılıyordu. Kök “bu şıklar arasında en dirençli” olarak değiştirildi; açıklama mantarların da daha dirençli olduğunu belirtiyor. Doğru şık yine bakteriyel sporlar. | [CDC 2008/2019](https://stacks.cdc.gov/view/cdc/134910/cdc_134910_DS1.pdf), s.34, direnç sıralaması; araştırma §2.3. |
| `15-cae-profilaksi-a.json` #11 | “Bu sistemlere” ifadesi başka bir karta bağımlıydı. Temiz-kontamine yara tanımında solunum, sindirim, genital ve üriner sistemler açıkça yazıldı. | WHO 2018, sözlükte yara sınıfları; [WHO metninin EBJIS kopyası](https://ebjis.org/wp-content/uploads/2025/08/Global-guidelines-for-the-prevention-of-surgical-site-infection.pdf), s.12; araştırma §3.H. |
| `16-el-hijyeni-atik-a.json` #3 | Standart önlemlerin vücut sıvısı kapsamındaki **ter istisnası** eksikti. Kaynaktaki sıvı/sekresyon/ekskresyon, hasarlı deri ve mukoza kapsamı yazıldı. | [CDC standart önlemler](https://www.cdc.gov/infection-control/hcp/isolation-precautions/precautions.html), IV.A; araştırma §2.16. |
| `16-el-hijyeni-atik-a.json` #4 | Tek kişilik oda koşulsuz gereklilik gibi görünüyordu. “Varsa” koşulu ve oda yetersizliğinde uygun yerleştirme/kohortlama seçeneği eklendi. | [CDC izolasyon önerileri](https://www.cdc.gov/infection-control/hcp/isolation-precautions/recommendations.html), V.B.2.a; araştırma §2.16. |
| `16-el-hijyeni-atik-b.json` #5 | Bir haftalık atık bekletme uzatımının yalnız sıcaklık şartı verilmişti. **Uygun depo kapasitesi** şartı da eklendi; iki şart birlikte gerektiği belirtildi. | [25 Ocak 2017 Resmî Gazete](https://resmigazete.gov.tr/eskiler/2017/01/20170125-2.htm), madde 12(2). |
| `18-prionlar-b.json` #3 | Yöntem 3'te “kimyasalda” denmesi, kart tek başına okununca kimyasal ve konsantrasyonu belirsiz bırakıyordu. **1 N NaOH veya 20.000 ppm serbest klorlu hipoklorit** açıkça eklendi. | [CDC CJD 2026](https://www.cdc.gov/creutzfeldt-jakob/hcp/infection-control/index.html), ısıya dayanıklı aletler yöntem 3; araştırma §2.18. |

Bu düzeltmelerden sonra yerel araştırma izleri temelinde incelenen 75 MCQ'da ikinci doğru şık veya 40 TF'de cevabı değiştirecek açık belirsizlik saptanmadı. Bu sonuç aşağıdaki dış kaynak erişim sınırlarını kaldırmaz. Doğru indeks dağılımı 0/1/2/3 için 19/19/19/18'dir.

## Dış kaynaklarda yeniden kontrol edilen bölümler

Aşağıdaki tablo, tüm dersin dış kaynak sertifikasyonu değildir; açılan kaynaklarda karşılaştırılan iddia gruplarını ve ilgili konuları gösterir. Aynı kaynağa bağlı diğer kartların yerel araştırma karşılaştırması, o kartın dış kaynağının tek tek yeniden doğrulandığı anlamına gelmez.

| Kaynak ve açılan bölüm | Karşılaştırılan iddia grubu / konu |
|---|---|
| [CDC dezenfeksiyon ve sterilizasyon kılavuzu, 2008/2019 PDF](https://stacks.cdc.gov/view/cdc/134910/cdc_134910_DS1.pdf), direnç, kimyasallar, sterilizasyon yöntemleri, izleme, sözlük ve tablolar 4/10 | Konular 01, 03, 04, 07–12: direnç; SAL ve D değeri; doğal yük/BI yükü; alkol, OPA, glutaraldehit ve peroksit değerleri; buhar/kuru ısı/EtO/plazma koşulları; Bowie-Dick; BI yükü ve inkübasyon; nem ve paket bütünlüğü. EtO mesleki sınırlarının süre/birim koşulları ve FDA implant tanımındaki 30 gün bağlamı da kontrol edildi. |
| [CDC kimyasal dezenfektanlar](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/chemical-disinfectants.html), [buhar](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/steam-sterilization.html), [sterilizasyon uygulamaları](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/sterilizing-practices.html) | Aynı CDC iddialarının ilgili HTML bölümleri; BI sıklığı, implant yükü ve karantinanın koşullu ifadesi. |
| [WHO 2018 resmî yayın kaydı](https://www.who.int/publications/i/item/9789241550475), [EBJIS'teki özgün WHO PDF'si](https://ebjis.org/wp-content/uploads/2025/08/Global-guidelines-for-the-prevention-of-surgical-site-infection.pdf), sözlük, §3.3.2, §4.2, §4.4, §4.7, Tablo 4.9.1 | Konular 06, 14, 15: manuel temizleme su sıcaklığı, cerrahi el hazırlığı, bilinen taşıyıcıda mupirosin, profilaksi zamanlaması, yara sınıfları, CHG'nin hassas dokulara teması ve alkolün kuruması. Yayın yılı/ISBN özgün WHO kaydıyla eşleştirildi; indirilen metin kurumsal kopyadır. |
| [WHO el hijyeni açıklaması](https://www.who.int/southeastasia/news/detail/03-05-2018-promote-hand-hygiene-to-enhance-the-safety-and-quality-of-health-care-facilities), [WHO 2009 cerrahi güvenlik listesi](https://cdn.who.int/media/docs/default-source/patient-safety/9789241598590-eng-checklist.pdf) | Konular 14–16: rutin el ovalama/yıkama süreleri, beş an, cerrahi listenin üç kontrol aşaması ve sterillik/ekipman/sayım kontrolleri. |
| [CDC NHSN Ocak 2026 SSI bölümü](https://www.cdc.gov/nhsn/pdfs/pscmanual/9pscssicurrent.pdf), tablolar 1/2 ve SSI ölçütleri | Konu 15: yüzeyel 30 gün; primer derin/organ-boşlukta işleme bağlı 30/90 gün; işlem günü 1 ve doku katmanları. Sürveyans ölçütleri klinik tanı sınırı olarak yorumlanmadı. |
| [CDC SSI 2017 özgün makale](https://stacks.cdc.gov/view/cdc/79361/cdc_79361_DS1.pdf), özet | Konu 15: ameliyat sırasında glisemi eşiğinin bağlamı, normotermi, temiz/temiz-kontamine işlemde insizyon kapandıktan sonra profilaksinin sürdürülmemesi. |
| [CDC izolasyon kapsamı](https://www.cdc.gov/infection-control/hcp/isolation-precautions/precautions.html), [öneriler](https://www.cdc.gov/infection-control/hcp/isolation-precautions/recommendations.html), [KKE posterindeki iki çıkarma örneği](https://www.cdc.gov/hai/pdfs/ppe/ppe-sequence.pdf) | Konu 16: standart/temas/damlacık/hava önlemleri, oda bulunabilirliği, KKE giyme ve çıkarma örnekleri, respiratörün odadan çıktıktan sonra çıkarılması ve ara el hijyeni. |
| [2017 Tıbbi Atıkların Kontrolü Yönetmeliği metni](https://resmigazete.gov.tr/eskiler/2017/01/20170125-2.htm), madde 10 ve 12 | Konu 16: kırmızı torbanın dayanıklılık/kalınlık ve doluluk koşulları, kesici-delici kutusu, geçici depo süresi ve uzatma şartları. Kartların verdiği **2017 metni** kontrol edildi. |
| [CDC mesleki maruziyet 2001](https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5011a1.htm), “Treatment of an Exposure Site” | Konu 16: deri için sabun/su, mukoza için su, sıkma/korozif uygulama yapılmaması. Güncel ilaç profilaksisi algoritması bu derste veya incelemede doğrulanmadı. |
| [ÇOMÜ sterilizasyon birimi prosedürü](https://cdn.comu.edu.tr/cms/dismer/files/282-dspr01-sterilizasyon-birimi-isleyis-proseduru.pdf), 11.10.2024 revizyonu | Konular 06, 12: protein testi, kontrol/kayıt ve ambalaja bağlı kurumsal raf ömrü. Kurumsal örneğin evrensel raf ömrü gibi kullanılmaması kontrol edildi. |
| [CDC çevresel enfeksiyon kontrolü: hava](https://www.cdc.gov/infection-control/hcp/environmental-control/air.html), [öneriler](https://www.cdc.gov/infection-control/hcp/environmental-control/summary-recommendations.html), C.V | Konu 13: 2003 kılavuzunun HEPA, ameliyathane hava değişimi/akış/pozitif basınç ve SSI önleme amacıyla UV kullanmama ifadeleri. Yeni bina standardı olarak genellenmedi. |
| [ISID ameliyathane bölümü 2018](https://isid.org/wp-content/uploads/2018/02/ISID_InfectionGuide_Chapter22.pdf), “Suggested practice” | Konu 13: yarı kısıtlı/kısıtlı alan ayrımı ve maske bağlamı. |
| [STERIS: altı ISO kimyasal indikatör tipi](https://emea.sterislifesciences.com/Resources/Technical-Learning-Library/Technical-Learning-Library-Folder/Articles/6-ISO-Types-of-Chemical-Indicators-for-Steam-Sterilization) | Konu 09: tip 1–6'nın işlevleri ve tiplerin kalite hiyerarşisi olmaması. Bu, üreticinin teknik özetidir; lisanslı ISO standardının tamamı açılmadı. |
| [FDA tıbbi cihaz sterilizasyonu](https://www.fda.gov/medical-devices/general-hospital-devices-and-supplies/sterilization-medical-devices) | Konu 08: Ocak 2024'te VH2O2'nin Established Category A'ya alınması ve EtO'nun cihaz/malzeme bağlamı. |
| [FDA su kullanan ısıtıcı-soğutucu önerileri](https://www.fda.gov/medical-devices/what-heater-cooler-device/recommendations-use-water-based-heater-cooler-devices) | Konu 17: ≤0,22 µm filtre/steril su, musluk ve deiyonize su uyarıları, egzoz yönü, üretici talimatı, ekipman sorununda hizmetten çıkarma. |
| [Sommerstein ve ark. özgün deneysel makale](https://wwwnc.cdc.gov/eid/article/22/6/16-0045_article), sonuçlar | Konu 17: dumanın 23 saniyede ulaşması ile mikroorganizma kültürünün farklı deneyler olduğu; 3/5 m kültür bulguları. |
| [CDC MMWR 2016](https://www.cdc.gov/mmwr/volumes/65/wr/mm6540a6.htm), genom karşılaştırması | Konu 17: cihaz/patient izolatlarının yakınlığı ve olası ortak üretim kaynağı; kesinlik düzeyi korunuyor. |
| [CDC CJD 21.01.2026](https://www.cdc.gov/creutzfeldt-jakob/hcp/infection-control/index.html), aletler/surfaces yöntemleri | Konu 18: üç alet yönteminin kimyasal, süre, durulama/suya aktarma, kap ve otoklav koşulları; 2 N yüzey uygulaması; doku riski ve tek kullanımlıkların imhası. |

## Sınırlar ve kalan kaynak işi

- **SKS 2021 sunumu doğrudan açılamadı:** [resmî PDF bağlantısı](https://khgm.saglik.gov.tr/Eklenti/41234/0/sterilizasyon-ve-ameliyathane-hizmetleripdf.pdf) bu oturumda erişim hatası verdi. Bu kaynağa atıf yapan 29 kart yerel araştırma ve yazar izleriyle karşılaştırıldı; hepsi için bağımsız dış kaynak doğrulaması iddia edilmiyor. Özellikle `09-testler-indikatorler-b.json` #1/#5 ve `-c.json` #4'teki kaçak testi/SBYS değerleri ile `12-depolama-b.json` #1/#2/#8'deki sıcaklık, nem, raf mesafeleri ve cep depo süresi doğrudan SKS metninden yeniden doğrulanamadı. SKS baskısı/bağlamı bu kartlarda korunuyor.
- **Children's Wisconsin politikası doğrudan açılamadı:** [politika PDF'si](https://childrenswi.org/-/media/chwlibrary/files/secure/protected-pages/staff/attire-policy-and-aseptic-techniques.pdf) erişim hatası verdi. Bu kaynağa bağlı 21 steril alan/giyinme kartı yerel araştırma izleriyle incelendi; özellikle `14-el-antisepsisi-b.json` #4'teki kolun steril bölgesi için 5 cm ölçüsü doğrudan dış kaynakta yeniden kontrol edilemedi. Kurumsal kaynak niteliği korunuyor.
- WHO'nun 2018 tam metin indirme bağlantısı açılamadığı için yukarıdaki özgün WHO metninin EBJIS kopyası kullanıldı. WHO 2009 özgün el hijyeni posterine doğrudan erişim sağlanamadı; rutin süreler WHO'nun bölgesel resmî açıklamasıyla karşılaştırıldı.
- Lisanslı ISO/AORN/ASHRAE tam metinleri açılmadı. STERIS özeti ISO tam metni yerine geçirilmedi; 2003 CDC hava değerleri güncel ASHRAE değerleri olarak sunulmadı.
- Atık kartlarında atıf yapılan 2017 yayımı doğrulandı; sonraki değişikliklerle birleştirilmiş güncel hukuk metninin bütünü incelenmedi. Tarihli kaynaklara dayanan kartlar güncel kurum prosedürlerinin yerine geçmez.
- Araştırmadaki her sayısal satırın karta dönüştüğünü veya tüm anlamsal tekrarların belirli bir yüzde sınırında olduğunu bağımsız olarak sayan ayrı bir envanter hazırlanmadı. Tarihçe ve erişilemeyen kaynakların bütün özgün iddiaları dışarıdan yeniden doğrulanmadı. Bu kayıt eğitim içeriği incelemesidir; klinik uygulama veya cihaz çevrimi onayı değildir.

## Yapısal doğrulama

Düzeltmelerden sonra `scripts/build-data.mjs` içindeki `buildCourse('content','PER247')`, `computeStats` ve `distributionWarnings` **yazma yapmadan** çalıştırıldı: hata `[]`, dağılım uyarısı `[]`; 518 kart, 18 konu, en az 18 kart/konu. Tür dağılımı: term 218, compare 20, fact 90, flip 50, remember 25, mcq 75, tf 40. Önem dağılımı: 1 → 100, 2 → 265, 3 → 153. JSON şeması, alan uzunlukları ve üreticinin tespit ettiği tekrar/dağılım kontrolleri geçti. Üretilmiş site verisinin genel doğrulaması ana görev tarafından ayrıca yapılır.

Sonuç: 54 dosyanın bağımsız içerik okuması tamamlandı, saptanan altı hata düzeltildi. Yukarıda işaretlenen SKS/Children's Wisconsin iddialarının doğrudan kaynak erişimiyle yeniden doğrulanması açık kaynak işi olarak kalır; kayıt bunları doğrulanmış dış kaynak iddiaları olarak kapatmaz.
