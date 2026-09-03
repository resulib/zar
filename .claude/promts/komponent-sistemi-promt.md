Bu addımda sənədlərin görünüş qatını qurmağını istəyirəm. Ən vacib şərt budur: heç bir şey bir konkret cinayət işinə bağlı olmasın. İndi birinci qovluğu qururuq, amma ikinci, üçüncü və onuncu qovluqların quruluşu tamam başqa olacaq — kiminin içində üç yazışma və bir xəritə, kiminin içində on cədvəl və bir laboratoriya rəyi. Ona görə render qatı hekayəni ümumiyyətlə tanımamalıdır. O, yalnız bloklar tanıyır, hekayəni isə baza verir.

Əsas fikir belədir. Bir sənəd hazır şablon deyil, blokların ardıcıllığıdır. Bazada sənədin məzmunu JSON kimi saxlanılır və içində blokların siyahısı olur. Render qatı bu siyahını gəzir, hər bloku öz komponentinə verir və nəticəni yığır. Yeni sənəd növü lazım olanda yeni şablon yazmırsan, mövcud blokları başqa sıra ilə düzürsən. Yeni bir blok növü isə ancaq həqiqətən yeni bir forma çıxanda əlavə olunur.

Blok növləri bunlar olsun və hər biri ayrıca komponent kimi yazılsın.

Blank başlığı — qurumun adı, iş nömrəsi, altında ayırıcı xətt. Sənədin növündən asılı olmayaraq eyni komponentdir, mətn isə parametrdir.

Başlıq bloku — mərkəzdə sənədin adı və altında kiçik izah sətri.

Sahə siyahısı — sol tərəfdə sahənin adı, sağda doldurulmuş dəyər, aralarında nöqtəli xətt. Rəsmi blanklarda ən çox görünən formadır. Bəzi sahələr boş qala bilməlidir, çünki real sənədlərdə boş sahə olur.

Mətn bloku — adi abzaslar. İçində qalın söz, əl ilə əlavə edilmiş söz və oxunmayan hissə işarələnə bilsin.

Cədvəl bloku — sütun adları və sətirlər. Bəzi sətirlər vurğulana bilsin. Sütun sayı sabit olmasın.

Kartoçka siyahısı — nömrələnmiş bloklar, hər birində başlıq və təsvir. Maddi sübutlar, əşyaların siyahısı, qutunun içindəkilər — hamısı bununla çıxır.

Yazışma bloku — söhbətin adı, son görülmə vaxtı, tarix ayırıcıları və mesajlar. Hər mesajda kimin yazdığı, mətn, saat və oxunma vəziyyəti olsun. Mesajın növü adi mətn, silinmiş mesaj, sistem qeydi, səsli mesaj, şəkil və ya sənəd ola bilsin. Səsli mesaj dalğa şəkli və müddət göstərsin, səs faylı varsa səsləndirsin, olmayanda isə yalnız görünsün. Yazışma kağızın üstünə çap edilmiş ekran görüntüsü kimi çərçivəyə salınsın və altında izah sətri olsun.

Zəng tarixçəsi bloku — vaxt, istiqamət, abunəçinin telefondakı adı və müddət.

Sxem bloku — SVG kodu bazadan gəlir və olduğu kimi çıxarılır. Sxemin üstünə əlavə oluna bilən ayrıca qat olsun: nömrələnmiş nöqtələr, ölçü xətləri, istiqamət oxları və şimal işarəsi. Bunlar sxemin öz kodunda deyil, ayrıca məlumat kimi verilsin ki, eyni sxemi müxtəlif mərhələlərdə fərqli nişanlarla göstərmək mümkün olsun.

Əlyazma bloku — qısa mətn üçün. Uzun izahatı bununla vermə, bu qayda komponentin özündə məhdudiyyət kimi olsun: müəyyən uzunluqdan çox mətn verilsə, xəbərdarlıq versin. Əlyazmanın xarakteri parametr olsun — sakit, tələsik, yaşlı adamın xətti, əsəbi. Hər variant üçün fərqli şrift, fərqli əyilmə və fərqli sətir aralığı.

Şəkil kartoçkası — foto və ya sənəd surəti, altında rəsmi izah sətri və nömrə.

Əlavə bloku — ataçla bərkidilmiş kiçik sənəd. Kassa çeki, aptek qəbzi, bilet, kiçik qeyd. Böyük sənədin üstündə, bir az əyri, ataç kölgəsi ilə görünsün.

İmza bloku — solda vəzifə və imza, sağda tarix.

Kənar qeydi — bu, blok deyil, hər hansı blokun üstünə əlavə edilə bilən nişandır. Qırmızı qələmlə sual işarəsi, dairəyə alınmış söz, kənarda bir cümlə, altdan xətt. Hansı bloka və hansı sözə aid olduğu məlumatda göstərilsin.

İndi fiziki görünüş barədə. Bunu ayrıca qat kimi qur, blok növlərindən asılı olmasın. Yəni istənilən sənədə istənilən effekt verilə bilsin, sadəcə bazadakı bir neçə açar ilə.

Effektlər bunlardır: kağızın köhnəlmə dərəcəsi, qatlanma xətləri və neçə yerdən qatlandığı, ləkə (qəhvə, yağ, su) və onun yeri, kənarların cırılması, kseroks surətinin keyfiyyəti, vərəqin bir-iki dərəcə əyilməsi, barmaq izi, ştapel və ataç izləri. Hamısı CSS və SVG ilə edilsin, hazır şəkil faylı istifadə olunmasın, çünki hər ölçüdə iti qalmalı və mətn seçilə bilən qalmalıdır.

Möhür də ayrıca qatdır. Möhürün mətni, forması (dairəvi və ya düzbucaqlı), rəngi, əyilmə bucağı, şəffaflığı və vərəqdəki yeri məlumatdan gəlsin. Bir sənəddə bir neçə möhür ola bilsin. Möhür mətnin üstünə düşəndə mətn oxunaqlı qalsın — şəffaflıq bunu təmin etsin.

Zədələnmiş mətn üçün ayrıca imkan olsun: bir sözün və ya sətirin oxunmaz olması, üstündən xətt çəkilməsi, kseroksda itməsi. Bu, oyun mexanikasıdır, ona görə mətnin hansı hissəsinin itdiyi məlumatda dəqiq göstərilsin.

Bir vacib qayda komponentin içinə yazılsın: bir sənəddə üçdən çox ağır fiziki effekt olmasın. Hər vərəq ləkəli və qatlanmış olanda heç biri seçilmir və göz yorulur. Effektlər yalnız əhəmiyyətli sənədlərə verilsin.

İndi kilid və gizli məzmun barədə. Kilid sənədin növü deyil, xassəsidir. Yəni istənilən sənəd kilidli ola bilər — cədvəl də, yazışma da, sxem də. Kilidli sənədin məzmunu heç bir halda brauzerə göndərilməsin. Kod yalnız serverdə yoxlanılsın, açılandan sonra məzmun sorğu ilə gəlsin. Kilidin növü də parametr olsun: dördrəqəmli kod, söz, tarix. Bu, gələcək qovluqlarda fərqli tapmacalar qurmağa imkan verəcək.

Sənədlərin hamısı bazadan gəlsin. Heç bir qovluğun heç bir sətri koda yazılmasın. Bir qovluq bir JSON faylı kimi hazırlansın və seed ilə bazaya yüklənsin. Yeni qovluq əlavə etmək kod yazmaq deyil, fayl yazmaq olmalıdır.

Ona görə də iki şey lazımdır. Birincisi, yoxlayıcı: JSON bazaya yüklənəndən əvvəl quruluşu yoxlanılsın, tanınmayan blok növü, çatışmayan sahə və ya səhv istinad olanda aydın xəta versin. Səbəbi budur ki, qovluqları mən yazacağam və səhv etsəm bunu dərhal bilməliyəm, render zamanı ağ ekran görməməliyəm.

İkincisi, komponent qalereyası. Yalnız işləyicilər üçün açıq olan bir səhifə qur, orada bütün blok növləri, bütün fiziki effektlər, bütün möhür variantları və bütün əlyazma xarakterləri nümunə ilə göstərilsin. Yeni qovluq yazanda mən bu səhifəyə baxıb hansı blokun mövcud olduğunu görməliyəm. Bu səhifə həm də sınaq yeridir: yeni komponent əlavə edəndə əvvəlcə orada görünsün.

Şriftlər barədə bir xəbərdarlıq. Əlyazma şriftlərinin əksəriyyətində Ə hərfi yoxdur. Hansı şrifti seçsən, əvvəlcə Ə, ə, ğ, İ, ı, ş, ç, ö, ü hərflərini hər qalınlıqda gözlə yoxla və nəticəni mənə göstər. Uyğun şrift tapılmasa dayan və mənə de, qısa əlyazmaları əl ilə yazıb şəkil kimi verəcəyik.

Hər üç ölçüdə düzgün işləməlidir. Telefonda sənəd tam eni tutur, kompüterdə isə mərkəzdə, məhdud enli sütunda qalır — kağız kağız kimi qalsın, ekranın hər tərəfinə yayılmasın. Yazışma bloku hər ölçüdə telefon eni saxlasın, çünki o, ekran görüntüsüdür və genişlənəndə həqiqiliyini itirir.

İşi belə apar. Əvvəlcə blok növlərinin siyahısını və JSON quruluşunu təsdiq üçün mənə yaz, kod yazma. Razılaşandan sonra komponentləri bir-bir qur və hər birini qalereyada göstər. Fiziki effekt qatını ən axırda əlavə et, çünki əvvəlcə mətnin özü düzgün oturmalıdır. Hər mərhələdən sonra dayan və nə etdiyini qısaca yaz.
