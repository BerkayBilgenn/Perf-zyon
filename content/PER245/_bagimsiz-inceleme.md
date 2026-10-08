# PER245 bağımsız içerik incelemesi

2026-10-08. İnceleyen: kartları yazan ajandan ayrı `review_per245` ajanı. Bu kayıt, yazara ait `_dogrulama-a/b/c.md` kayıtlarının yerine bağımsız inceleme sonucunu belirtir; önceki kaynak erişimi iddialarını yeniden yapılmış gibi göstermez.

## Kapsam ve sonuç

18 konunun 54 JSON dosyasındaki **513 kartın tamamı** okundu; araştırma dosyasındaki ilgili konu/sözlük/önemli bilgiler ve kart yazım şartnamesi §3/§10 ile karşılaştırıldı. 75 MCQ için kök, doğru seçenek, bütün çeldiriciler ve açıklama; 39 TF için doğruluk ve istisna/bağlam; diğer türler için tanım, kapsam, birim, kaynak ve öğrenme hedefi incelendi. İçerik, sıralama ve araştırma izi birlikte ele alındı. Aşağıdaki envanter her dosyada incelenen sıra aralığını gösterir.

10 kartta düzeltme yapıldı: 2 MCQ kökü/seçeneği, 5 terim tanımı/adı ve 3 kaynak atfı. Kart eklenmedi, silinmedi veya yeniden sıralanmadı. Bu kapsamda doğrulanmış ve düzeltilmemiş bir hata bırakılmadı. Bu ifade bütün dış kaynakların her paragrafının yeniden doğrulandığı anlamına gelmez; dış doğrulamanın kapsamı ve sınırlamaları aşağıdadır.

Dağılım: term 215, fact 95, mcq 75, flip 45, tf 39, remember 24, compare 20. Önem: 3 → 93, 2 → 389, 1 → 31. Her konuda en az 20 kart; toplam ≥450 ve tür dağılımı şartname toleransında.

## Yapılan düzeltmeler

| Dosya / sıra | Düzeltme ve gerekçe | Araştırma / dış kanıt |
|---|---|---|
| `11-eriskin-kkh-c.json` #1 | Genel “birlikte olabilir” sorusu, sağ pulmoner venlerin bir bölümünün VCS/SA'ya açılmasını tanımlayan soru oldu. PLSVC de ASD ile birlikte bulunabildiğinden eski kök tek cevabı yeterince sınırlamıyordu. PAPVR doğru seçenek olarak korundu. | §2.11; [ESC 2020](https://www.heartuniversity.org/wp-content/uploads/esc-guidelines-for-the-management-of-achd-2020.pdf), §4.1.1; kaynak atfı K56 oldu. |
| `17-hipotermi-kardiyopleji-c.json` #3 | “Beynin gerçek sıcaklığı” yerine “serebral perfüzat sıcaklığı” soruldu; seçenekler aynı ölçüm nesnesini kullanıyor. Kaynak ifadesi ile kök uyumlu oldu. | §2.17; [STS 2015](https://www.sts.org/sites/default/files/documents/Guidelines_CPB%20Temperature%20Management.pdf), öneriler s1–2. |
| `17-hipotermi-kardiyopleji-a.json` #13 | Antegrad tanımına doğrudan koroner ağızlarından uygulama eklendi; aort kökü tek yol gibi sunulmadı. | §2.17'de antegrad/ostial yollar; [EACTS 2024](https://iperfusion.org/wp-content/uploads/2025/02/EBCP-Guidelines-on-cardiopulmonary-bypass-in-adult-cardiac-surgery.pdf), §7.5.1. Kaynak K3 oldu. |
| `13-perfuzyonist-hesaplar-a.json` #9 | DO2i'nin DO2/VYA olduğu tanıma eklendi. | §2.13; K3, indeks ve toplam oksijen sunumu ayrımı. |
| `11-eriskin-kkh-a.json` #4 | Unroofed koroner sinüsün adına doğrudan eşanlamlı gibi eklenen “Raghib” kaldırıldı; temel tanım korundu. | §2.4; [özgün olgu bildirimi](https://pmc.ncbi.nlm.nih.gov/articles/PMC3558062/), Discussion, Raghib ile UCS–PLSVC birlikteliği ayrımı. |
| `09-siyanotik-kkh-a.json` #5 | Greftli bağlantının modifiye şant olduğu açıklandı. | §2.9; [UMN tek ventrikül atlası](https://www.vhlab.umn.edu/atlas/congenital-defects-tutorial/left-heart-lesions/single-ventricle.shtml), greftli şant ve evreli palyasyon. |
| `16-kpb-yurutme-a.json` #3 | Total KPB'nin tanımı sistemik venöz dönüşe dayandırıldı; snare kullanımı bikaval izolasyon bağlamına alındı. Aynı dosyanın #15 karşılaştırmasıyla uyum sağlandı. | §2.16; [Kumar 2020](https://jtd.amegroups.org/article/view/37145/html), Intracardiac procedure, kaval snare'lerin kullanım bağlamı. |
| `18-kpb-cikis-komplikasyon-a.json` #12/#13 ve `18-kpb-cikis-komplikasyon-b.json` #3 | Oksijenatör yetmezliği, su–kan kaçağı ve ilk gaz kontrolü atıfları K3'ten araştırmada ilgili bilgiyi taşıyan K9'a düzeltildi; metin değişmedi. | §2.18 / sözlük #211–212; [National Heart Center 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13227424/), Oxygenator failure / Water-to-blood leak. Erişim sınırı aşağıdadır. |

## Doğrudan dış kaynaklarla kontrol edilen hedefler

Dış kontrol önceliği, birim veya sayısal eşik içeren hedeflere ve klinik karar açısından önemli ifadelere verildi. Kısa kaynak adları araştırma §7 ile eşleşir. Dosyalarda aşağıdaki sıra numaraları değişmedi.

| Kaynak ve yer | Kartlar / kontrol edilen hedefler |
|---|---|
| [K3 EACTS/EACTAIC/EBCP 2024, özgün kılavuz PDF](https://iperfusion.org/wp-content/uploads/2025/02/EBCP-Guidelines-on-cardiopulmonary-bypass-in-adult-cardiac-surgery.pdf), §10.1.1 | `08-aort-cerrahisi-b` #2–3: ACP 10–15 mL/kg/dk, sağ radiyal 40–80 mmHg; RCP juguler yaklaşık 20 mmHg ve 100–500 mL/dk. Ölçüm yeri ayrımı korundu. |
| K3 Tablo 43 | `13-perfuzyonist-hesaplar-b` #11: normotermik DO2i 280–300 mL/dk/m² → IIa-B; GDP → I-A. |
| K3 Tablo 40/45 | `16-kpb-yurutme-b` #9–10: MAP 50–80 mmHg, önce yeterli akım/anestezi; Hct <%18 ve %18–24 bağlamı. |
| K3 §7.5.1/Tablo 28/§9.1.1/§10.3 | `17-hipotermi-kardiyopleji-a` #8/#11/#13/#14/#19/#21/#22 ve `17-b` #7–8; `15-antikoagulasyon-b` #8: kardiyopleji yolları/oranları, HTK izo-ozmotik bağlamı, alfa/pH-stat, en fazla 37 °C, protamin başlangıcında kardiyotomi aspirasyonunu durdurma. |
| [K5 STS/SCA/AmSECT 2015, kuruluş PDF](https://www.sts.org/sites/default/files/documents/Guidelines_CPB%20Temperature%20Management.pdf), ilk öneriler ve Tablo 1 | `17-hipotermi-kardiyopleji-b` #1–2, `17-c` #3: genel gradyan ≤10 °C; arteriyel çıkış ≥30 °C ise ısıtmada ≤4 °C ve ≤0,5 °C/dk; serebral perfüzat vekili. STS'nin <37 °C ifadesi ile K3'ün en fazla 37 °C ifadesi karıştırılmadı. |
| [K6 STS/SCA/AmSECT 2018, kuruluş PDF](https://www.sts.org/sites/default/files/documents/Anticoagulation-During-Cardiopulmonary-Bypass-Guideline-2018.pdf), Anticoagulation/HIT/Protamine | `15-antikoagulasyon-b` #1–3/#7; `15-c` #1–2; `18-b` #6: ACT >480 sn, cihaz bağlamında >400 sn; hemodilüsyon/hipotermi etkisi; HIT 5–14 gün ve >%50 düşüş, SRA; ciddi protamin reaksiyonunda uygun antikoagülasyonla yeniden KPB. |
| [K7 AmSECT 2013, kuruluş PDF](https://amsect.org/Portals/0/2013%20Standards%20and%20Guidelines%20for%20Perfusion%20Practice%20AmSECT%20-JECT.pdf), Standard 4/6/7, dipnot 15 | `13-perfuzyonist-hesaplar-b` #6/#9, `13-c` #1–2; `18-b` #9, `18-c` #5/#7: checklist aşamaları, gaz/güç/el krankı yedeği, VYA formülü ve indeks × VYA. Verilen hesap örnekleri ayrıca yeniden hesaplandı (4,56 / 4,32 / 2,4). |
| [K45 aynı yazarların üniversite deposundaki yayınevi PDF'si](https://ppm.sum.edu.pl/docstore/download/SUMdb7fea58af22421685d8f22b0a3fb159/0000120267.pdf?entityId=SUM841699d16b8f4ed98b9fb61060026953&entityType=article), Table 1; ayrıca [özgün klinik çalışma Methods](https://pmc.ncbi.nlm.nih.gov/articles/PMC4683924/) | `13-perfuzyonist-hesaplar-b` #6: Mosteller √(W×H/3600); cm/kg/m² birimleri K7 dipnotu ve klinik çalışmada açık. |
| [K25 Boston Children's özgün yazar makalesi](https://pmc.ncbi.nlm.nih.gov/articles/PMC4557532/), Composition | `17-hipotermi-kardiyopleji-a` #22, `17-b` #3: del Nido kan:kristaloid 1:4; tek doz yaklaşımı evrensel tekrar süresi olarak öğretilmedi. |
| [K43 UMN primary heart tube](https://www.vhlab.umn.edu/atlas/congenital-defects-tutorial/normal-cardiac-development/primary-heart-tube.shtml); [Columbia insan embriyolojisi](https://www.columbia.edu/itc/hs/medical/humandev/2004/Chapt7-Heart2.pdf), aortic arches | `04-embriyoloji-fetal-b` #2 ve `04-a` #13: yaklaşık 22. gün ve 6. ark/duktus kökeni. |
| [K64 WSU Gross Anatomy Lab 8](https://learning.medicine.wsu.edu/wp-content/uploads/sites/4/2021/09/PDF-Lab-8.pdf), basılı s12–14 | `01-mediasten-b` #2: angulus sterni/T4–T5 düzlemi ve temel mediasten/büyük damar sınırları. |
| [K56 ESC 2020 özgün kılavuz PDF kopyası](https://www.heartuniversity.org/wp-content/uploads/esc-guidelines-for-the-management-of-achd-2020.pdf), §4.1–4.3 | `11-eriskin-kkh-c` #1; `12-sant-fizyolojisi-b` Eisenmenger-kapatma hedefi: ASD/VSD/PDA için Eisenmenger'de kapatmama bağlamı. |
| [K10 yazarların yayınevi tam metni](https://jtd.amegroups.org/article/view/37145/html), Venting / Initiation / Intracardiac procedure / Separation | `16-kpb-yurutme` ve `17-hipotermi-kardiyopleji` içindeki vent, venöz dönüş, akım dengesi, aort yetmezliğinde kök kaçışı, snare ve hot shot hedefleri; `18` ayrılma/deairing hedefleri. Tam metinde görülmeyen resim tablosu bağımsız okunmuş sayılmadı. |

## Erişim ve yorum sınırlamaları

- 513 kartın araştırma metniyle ve soru mantığıyla karşılaştırılması tamdır. Dış kaynak kontrolü yukarıdaki hedeflerle sınırlıdır; araştırmadaki bütün K bağlantılarının tam metinleri bu incelemede yeniden açılmadı. Diğer nitel hedeflerin izleri `_dogrulama-a/b/c.md` ve araştırma §2/§3/§5/§7'ye dayanır.
- K6 için PMC erişim kontrolü yerine STS'nin özgün PDF'si kullanıldı. K45 yayınevi sayfası açılamadığından aynı yayının Medical University of Silesia deposundaki yayınevi PDF'si kullanıldı.
- K9 PMC sayfasının doğrudan açımı erişim kontrolüne takıldı; arama aracının kaynak sayfadan döndürdüğü “Oxygenator failure / Water-to-blood leak / Power supply failure” pasajları okundu. Derginin [özgün yayın kaydı](https://smj.researchcommons.org/journal/vol47/iss2/17/) ve DOI doğrulandı, fakat indirme bağlantısı 403 döndürdü. K9'un tamamını doğrudan açarak okuma iddiası yoktur. Düzeltilen üç atıf mevcut araştırma K9 izi ve bu pasajlarla uyumludur.
- K7 yılı açıkça 2013 olan kartlar o tarihli metni öğretir; en güncel AmSECT standardının eksiksiz özeti oldukları iddia edilmez. 2014 görev tanımı kartı da güncel hukuk incelemesi olarak sunulmadı.
- İçerik bağımsız ajan incelemesidir; hekim/perfüzyon eğitmeni tarafından klinik kullanım onayı değildir. Kaynaklar arasında değişen dozlar, kesin güvenli arrest süresi ve evrensel hasta hedefleri eklenmedi.

## Mekanik doğrulama

`buildCourse('content', 'PER245')` bellekte çalıştırıldı: JSON/kart şeması hatası 0, dağılım uyarısı 0, 513 kart / 18 konu. Üretilmiş site verisi bu inceleme tarafından yazılmadı. Her kartta boş olmayan `source` bulundu; 54 dosyanın `_dogrulama-a/b/c.md` sıra izleri #1…#N ile eksiksiz eşleşti. Dosya başına kart sayısı HEAD ile aynı; değişiklikler yerinde yapıldı.

## İncelenen dosya ve sıra envanteri

| Dosya | İncelenen sıralar | Kart |
|---|---|---|
| `01-mediasten-a.json` | #1–#9 | 9 |
| `01-mediasten-b.json` | #1–#9 | 9 |
| `01-mediasten-c.json` | #1–#6 | 6 |
| `02-kalp-anatomisi-a.json` | #1–#13 | 13 |
| `02-kalp-anatomisi-b.json` | #1–#9 | 9 |
| `02-kalp-anatomisi-c.json` | #1–#6 | 6 |
| `03-ileti-sistemi-a.json` | #1–#10 | 10 |
| `03-ileti-sistemi-b.json` | #1–#9 | 9 |
| `03-ileti-sistemi-c.json` | #1–#6 | 6 |
| `04-embriyoloji-fetal-a.json` | #1–#15 | 15 |
| `04-embriyoloji-fetal-b.json` | #1–#9 | 9 |
| `04-embriyoloji-fetal-c.json` | #1–#6 | 6 |
| `05-mikrosirkulasyon-a.json` | #1–#10 | 10 |
| `05-mikrosirkulasyon-b.json` | #1–#9 | 9 |
| `05-mikrosirkulasyon-c.json` | #1–#6 | 6 |
| `06-kabg-a.json` | #1–#6 | 6 |
| `06-kabg-b.json` | #1–#8 | 8 |
| `06-kabg-c.json` | #1–#6 | 6 |
| `07-kapak-cerrahisi-a.json` | #1–#9 | 9 |
| `07-kapak-cerrahisi-b.json` | #1–#9 | 9 |
| `07-kapak-cerrahisi-c.json` | #1–#6 | 6 |
| `08-aort-cerrahisi-a.json` | #1–#15 | 15 |
| `08-aort-cerrahisi-b.json` | #1–#8 | 8 |
| `08-aort-cerrahisi-c.json` | #1–#6 | 6 |
| `09-siyanotik-kkh-a.json` | #1–#26 | 26 |
| `09-siyanotik-kkh-b.json` | #1–#9 | 9 |
| `09-siyanotik-kkh-c.json` | #1–#6 | 6 |
| `10-obstruktif-kkh-a.json` | #1–#9 | 9 |
| `10-obstruktif-kkh-b.json` | #1–#9 | 9 |
| `10-obstruktif-kkh-c.json` | #1–#6 | 6 |
| `11-eriskin-kkh-a.json` | #1–#10 | 10 |
| `11-eriskin-kkh-b.json` | #1–#9 | 9 |
| `11-eriskin-kkh-c.json` | #1–#6 | 6 |
| `12-sant-fizyolojisi-a.json` | #1–#7 | 7 |
| `12-sant-fizyolojisi-b.json` | #1–#8 | 8 |
| `12-sant-fizyolojisi-c.json` | #1–#6 | 6 |
| `13-perfuzyonist-hesaplar-a.json` | #1–#10 | 10 |
| `13-perfuzyonist-hesaplar-b.json` | #1–#11 | 11 |
| `13-perfuzyonist-hesaplar-c.json` | #1–#6 | 6 |
| `14-devre-priming-a.json` | #1–#17 | 17 |
| `14-devre-priming-b.json` | #1–#10 | 10 |
| `14-devre-priming-c.json` | #1–#7 | 7 |
| `15-antikoagulasyon-a.json` | #1–#13 | 13 |
| `15-antikoagulasyon-b.json` | #1–#9 | 9 |
| `15-antikoagulasyon-c.json` | #1–#6 | 6 |
| `16-kpb-yurutme-a.json` | #1–#18 | 18 |
| `16-kpb-yurutme-b.json` | #1–#10 | 10 |
| `16-kpb-yurutme-c.json` | #1–#8 | 8 |
| `17-hipotermi-kardiyopleji-a.json` | #1–#22 | 22 |
| `17-hipotermi-kardiyopleji-b.json` | #1–#9 | 9 |
| `17-hipotermi-kardiyopleji-c.json` | #1–#8 | 8 |
| `18-kpb-cikis-komplikasyon-a.json` | #1–#16 | 16 |
| `18-kpb-cikis-komplikasyon-b.json` | #1–#10 | 10 |
| `18-kpb-cikis-komplikasyon-c.json` | #1–#7 | 7 |
