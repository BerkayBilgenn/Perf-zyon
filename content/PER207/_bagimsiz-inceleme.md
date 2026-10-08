# PER207 bağımsız içerik incelemesi — 2026-10-08

Bu kayıt, kartların yazar kontrolünden ayrı bir incelemeye aittir. `research/PER207.md`, `research/PER207-2.md`, konu tablosu ve `docs/KART-YAZIM-SPEC.md` §3/§10 esas alındı. Üç `_dogrulama-*` dosyasındaki yazar kaynak izleri de incelendi.

## Kapsam ve sonuç

47 JSON dosyasındaki **517 kartın tamamı** içerik, dil, kaynak izi ve ders kapsamı açısından okundu. 75 çoktan seçmeli sorunun cevap/çeldirici ilişkileri, 40 doğru/yanlış ifadesinin anlamı ve açıklaması ayrıca incelendi. İnceleme sonucunda 8 dosyada **12 kart düzeltildi**. Kart eklenmedi, silinmedi veya yeniden sıralanmadı; konu ve tür sayıları korundu. Düzeltilen sorulardan sonra bu taramada başka çoklu doğru cevap veya araştırma dosyasıyla açık çelişki saptanmadı.

Bu sonuç bütün tıbbi iddiaların klinisyen onayı veya bütün dış kaynakların tek tek yeniden açıldığı anlamına gelmez. Dış doğrulama aşağıdaki erişilebilen birincil belgelerin ilgili bölümlerine odaklandı; kapsam ve erişim sınırları ayrıca belirtilmiştir.

| Konu | Kart | Konu | Kart |
|---|---:|---|---:|
| 01 Tanım/tarihçe | 15 | 10 ECCO2R/neonatal | 26 |
| 02 Modlar | 22 | 11 İABP/Impella/TandemHeart | 41 |
| 03 Fizyoloji | 27 | 12 VAD | 33 |
| 04 Devre | 53 | 13 TAH | 24 |
| 05 Endikasyon/ECPR | 39 | 14 Transplantasyon | 26 |
| 06 Kanülasyon | 32 | 15 Minimal invaziv/MiECC | 21 |
| 07 Yönetim | 32 | 16 Kriz yönetimi | 17 |
| 08 Komplikasyonlar | 34 | 17 Pediatrik KPB | 22 |
| 09 Antikoagülasyon | 53 | **Toplam** | **517** |

Tür dağılımı: term 209, fact 98, mcq 75, flip 50, tf 40, remember 25, compare 20. Her konu en az 15 kart içeriyor.

## Düzeltmeler

Kart numaraları dosya içindeki 1 tabanlı mevcut sırayı belirtir.

| Dosya/kart | Düzeltme ve gerekçe | Dayanak |
|---|---|---|
| `02-ecmo-modlari-b.json` #8 | V-VA/V-AV sorusu evet/hayır yerine fizyolojik ilişkiyi ve harf sırasını sorduracak biçime getirildi. | Maastricht 2019, adlandırma bölümündeki kronoloji açıklaması |
| aynı dosya #11 | VA’da sweep kapatma yasağı ileri yönlü akıma bağlandı; kontrollü retrograd ayırma denemesi (PCRTO) istisnası eklendi. | ELSO VA 2021, ayırma bölümü, s. 841 |
| `04-ecmo-devresi-b.json` #6 | Kaynakta doğrudan gösterilemeyen “birçok merkez −100 mmHg hedefler” ifadesi yerine doğrulanabilen negatif basınç/güvenlik bağlamı yazıldı. −300 mmHg’nin hasta hedefi olmadığı korundu. | ELSO Genel 2017 pompa özellikleri; Devre 2022 basınç izleme bölümü |
| aynı dosya #9 | 50 mg/dL eşik sorusu “hemolizin tek tanı sınırı” yerine ELSO 2017’de nedeni araştırılacak pfHb düzeyini sorar hale getirildi. | ELSO Genel 2017, II.A.2, s. 5 |
| aynı dosya #17 | Negatif basınçlı hatta erişim yasağı tarihli ELSO 2017 önerisi olarak sınırlandı. Devre tasarımı/protokol bağlamı eklendi; 2022 belge basınç izlemeye yönelik luer bağlantıyı tarif ediyor. | ELSO Genel 2017, II.D; Devre 2022, s. 138 |
| aynı dosya #18 | RPM/akım sorusu evet/hayır yerine ölçülen büyüklükleri sorduracak biçime getirildi; akım hacim/zaman olarak netleştirildi. | ELSO Devre 2022, akım izleme bölümü |
| `05-endikasyonlar-a.json` #20 | ELSO ECPR örnek seçim tablosundaki low-flow aralığı arrest→ECMO olarak netleştirildi; kompresyon başlangıcı→ECMO aralığıyla aynı olmadığı belirtildi. | ELSO ECPR 2021, Tablo 1 |
| `07-ecmo-yonetimi-a.json` #3 | ECMO öncesi prone önerisine “kontrendikasyon yoksa” koşulu eklendi. | ELSO VV 2021, Tablo 1 ve prone açıklaması |
| `07-ecmo-yonetimi-b.json` #3 | Ayırma değerlendirmesindeki Vt ≤ 6 mL/kg için **öngörülen vücut ağırlığı (PBW)** eklendi. | ELSO VV 2021, Tablo 5 |
| `08-komplikasyonlar-a.json` #12 | Dönüş tarafının her ECMO modunda arteriyel olduğu izlenimi giderildi: VA arteriyel, VV venöz dönüş. | ELSO VV/VA ve Maastricht mod tanımları |
| `10-ecco2r-neonatal-b.json` #1 | Oİ formülünde hava yolu basıncının cmH2O, PaO2’nin mmHg, FiO2’nin 0–1 kesir olduğu açıklandı. | ELSO Neonatal 2017, s. 4, formül ve postduktal örnek açıklaması |
| `13-tah-b.json` #5 | FDA onay kartının kaynağı onay tarihinden önceki NEJM 2004 çalışması yerine FDA SynCardia 2004 olarak düzeltildi. | FDA P030011 onay mektubu, 15 Ekim 2004 |

## Hedefli dış doğrulama

Aşağıdaki satırlar erişilen belgenin ilgili pasajlarının incelendiğini belirtir; belgenin bütün içeriği veya bu kaynağa bağlı bütün kartlar için sınırsız onay değildir. Ayna sunucularındaki PDF’ler, özgün belge başlığı/sürümüyle kontrol edildi.

| Birincil belge | Bu turda karşılaştırılan bilgiler |
|---|---|
| [ELSO Genel 2017, v1.4 — özgün PDF’nin ayna kopyası](https://www.biomedsimulation.com/wp-content/uploads/2025/02/ELSO-General-Guidelines-for-ECLS.pdf) | Kapasite ve mortalite risk eşikleri, pfHb, rated flow örneği, prime, negatif basınçlı erişim, tüp çapı/akım ilişkisi. Resmî eski URL bu turda açılamadı. |
| [ELSO VV 2021](https://www.elso.org/Portals/0/files/pdf/Management_of_Adult_Patients_Supported_with.1.pdf) | Başlama eşikleri, oksijen sunumu/akım oranı, resirkülasyon, prone koşulu, rest ventilasyonu, Tablo 5 ayırma ölçütleri/PBW, sweep-off ve dekanülasyon. |
| [ELSO VA 2021](https://www.elso.org/Portals/0/files/pdf/ELSO_Interim_Guidelines_for_Venoarterial.2.pdf) | Şok zamanlaması ve kontrendikasyonlar, SAVE, kanül/DPK/NIRS, LV distansiyonu, ayırma adımları, PCRTO, eko ölçütleri. |
| [ELSO Antikoagülasyon 2021](https://www.elso.org/Portals/0/files/pdf/2021_ELSO_Adult_and_Pediatric_Anticoagulation.1.pdf) | UFH/DTİ mekanizmaları, tarihli ve doğrulanmamış aPTT hedefi, anti-Xa, kanama durumuna göre trombosit/fibrinojen Tablo 6, pigment girişimi ve serbest Hb etkileri. |
| [ELSO ECPR 2021](https://www.elso.org/Portals/0/files/pdf/Extracorporeal_Cardiopulmonary_Resuscitation_in.1.pdf) | Tablo 1’in yaş/no-flow/low-flow/ETCO2 sınırları, kanülasyon zamanlaması, sağkalım/nörolojik sonuç bağlamı. |
| [ELSO Neonatal 2020](https://www.elso.org/Portals/0/files/pdf/Extracorporeal_Life_Support_Organization__ELSO__.1.pdf) ve [Neonatal 2017 özgün belgenin ayna kopyası](https://www.heartuniversity.org/wp-content/uploads/ELSO-2017-Guidelines-Neonatal-Respiratory-Failure.pdf) | Oİ formülü/örnek ve endikasyon, göreceli prematürite/ağırlık riskleri, İVK ve anomali ayrımları, neonatal sağkalım ve gaz hedefleri. |
| [Maastricht 2019](https://link.springer.com/article/10.1186/s13054-019-2334-8) | Tire/membran, drenaj/dönüş, hibrit mod kronolojisi ve eşdeğerliği, French ve uzunluk birimleri. |
| [ELSO Devre 2022 — özgün PDF’nin meslek kuruluşu ayna kopyası](https://www.tsrmpstrpmore.it/tfcpc/wp-content/uploads/sites/22/2022/03/ELSO_Guidelines_for_Adult_and_Pediatric.1-1.pdf) | Giriş basıncı izleme/erişim, akım probu, ΔP ve trombozun koşullu yorumu, steril prime bekleme bağlamı. |
| [IABP-SHOCK II, özgün çalışma özeti](https://pubmed.ncbi.nlm.nih.gov/22920912/) ve [DanGer Shock, özgün çalışma özeti](https://pubmed.ncbi.nlm.nih.gov/38587239/) | Sırasıyla 30 ve 180 gün sonlanımının yönü, analiz grubu ve mortalite oranları. |
| [REST, özgün JAMA yayını](https://jamanetwork.com/journals/jama/fullarticle/2783809) | ECCO2R çalışmasının 90 gün mortalitesi ve anlamlı yarar bulunmaması. |
| [ACC Hemodinamik Destek El Kitabı, Bölüm 11](https://www.acc.org/-/media/Non-Clinical/Files-PDFs-Excel-MS-Word-etc/Membership/Coronary-Interventions-Handbook/Chapter-11_Hemodynamic-Support.pdf) | İABP konumu/zamanlaması, Impella ve TandemHeart kan akım yolları/kontrendikasyonları. |
| [FDA SynCardia onay mektubu](https://www.accessdata.fda.gov/cdrh_docs/pdf3/P030011A.pdf), [FDA SynCardia güvenlik özeti](https://www.accessdata.fda.gov/cdrh_docs/pdf3/P030011b.pdf), [FDA AbioCor güvenlik özeti](https://www.accessdata.fda.gov/cdrh_docs/pdf4/H040006b.pdf) | Onay tarihleri, BTT/HDE ayrımı, uygun hasta, hacim/valf ve transkütan enerji aktarımı. |
| [FDA HeartMate 3 kullanım belgesi](https://www.accessdata.fda.gov/cdrh_docs/pdf16/P160054S008D.pdf) | Pompa akım göstergesinin güç/hıza dayalı **tahmini** olması. |
| [FDA OCS Heart kullanım belgesi, PROCEED II eki](https://www.accessdata.fda.gov/cdrh_docs/pdf18/P180051S001D.pdf) | Çalışma tasarımı, 30 gün hasta/orijinal kalp sağkalımı ve mekanik destek içermeyen sonlanım tanımı. |
| [MiECTiS 2016 özgün uzlaşı](https://www.miectis.org/wp-content/uploads/2014/10/MiECTiS_Consensus_Manuscript_ICVTS_2016.pdf) | MiECC devre bileşenleri, Tip II asgari şartı ve III/IV rezervuar farkları. |
| [Pisano 2021, özgün seri](https://jtd.amegroups.org/article/view/48985/html) | Endoaortik balonun TEE, bilateral radiyal basınç ve NIRS ile izlenmesi. |
| [Ramakrishnan 2023, özgün uygulama yazısı](https://tp.amegroups.org/article/view/115699/html) | LeBonheur’a özgü yüksek akım/Hct yaklaşımı, ağırlık gruplarının akım değerleri ve soğutma/ısıtma stratejisi. Evrensel hedef olarak kullanılmadığı kontrol edildi. |

## Sınırlar ve araştırma dosyası notları

- CESAR, EOLIA, REMATCH, erken neonatal randomize çalışmalar ve bazı tarihçe kaynaklarının özgün tam metin/özet erişim denemeleri hata veya erişim engeli verdi. Bu iddialar araştırma ve mevcut yazar kayıtlarıyla karşılaştırıldı; bu tur için yeniden dış doğrulama tamamlandı sayılmadı. EOLIA’nın arama motorunda görünen özgün özetinin bir bölümü okunabildi; bu, bütün sonuç tablosunun incelenmesi değildir.
- Transplantasyon tarihçesi/EVLP, bazı cihaz boyutları, MUF ve del Nido gibi kalan kaynakların her sayı ve pasajı bu turda yeniden dışarıdan açılmadı. Kaynak izi varlığı ile bağımsız dış doğrulama ayrı tutuldu. §10.1.2’deki **her sayının ayrıca doğrulanması** şartı için bu kayıt tek başına eksiksiz kanıt değildir.
- Matte 2024 kriz yazısının indekslenen özgün metni incelendi; PMC/yayıncı tam metin erişimi engellendi. Bu da tam metin doğrulaması olarak sayılmadı.
- Araştırma dosyasının özetindeki “VA’da sweep kapatılamaz” ifadesi PCRTO istisnasını, “> 50 mg/dL hemoliz demektir” ifadesi eşik bağlamını eksik bırakıyor; bazı Vt satırları PBW’yi açmıyor. Kartlar bu turda birincil kaynakla daraltıldı. Araştırma dosyaları bu incelemenin yazma kapsamında değildi; bu farklar yukarıda açıkça kaydedildi.

## Biçim ve sayı doğrulaması

2026-10-08’de son düzeltmelerden sonra `buildCourse('content', 'PER207')`, `computeStats` ve `distributionWarnings` ile yazma yapmadan doğrulandı: **0 şema/derleme hatası, 0 dağılım uyarısı, 517 kart, 17 konu**. `HEAD` ile dosya bazında karşılaştırmada bütün 47 dosyanın kart sayısı eşit kaldı. İçerik değişiklikleri tam olarak yukarıdaki 12 sırayla sınırlıydı. Site verisi üretimi ve tüm proje testleri bu içerik incelemesinin kapsamı dışındadır.
