/* Aksarium — keyboard gallery.
   Layout data, layer switching and the typing drill.
   Drill sentences are factual statements about the language itself, each with
   an English translation; for RTL scripts the field runs dir="rtl". The point
   of the drill is comfort with direction and key placement, not speed.

   Layout data is taken from the shipped Windows drivers (raw KLC dumps via
   kbdlayout.info) and cross-checked against the Unicode CLDR keyboard data;
   the per-key record is in aksarium-keyboard-gallery-build-2026-08-04.md.
   A dotted circle (U+25CC) is printed under combining marks so the keycap
   shows where the mark sits rather than leaving it floating unattached. */

(function () {
  'use strict';

  var DC = '◌'; /* dotted circle, for combining marks on keycaps */

  var LAYOUTS = {
    arabic: {
      label: 'Arabic — Mac 102',
      title: 'لوحة المفاتيح العربية',
      dir: 'rtl',
      sub: 'Arabic Mac 102. Shift carries the harakat, the tanween and the lam-alef ligatures.',
      meta: ['ق — qāf', 'U+0642', 'Persian, Urdu, Pashto'],
      source: { mac: 'Arabic', win: 'Arabic (101)' },
      base: { '`':'ذ','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩','0':'٠','-':'-','=':'=',
        Q:'ض',W:'ص',E:'ث',R:'ق',T:'ف',Y:'غ',U:'ع',I:'ه',O:'خ',P:'ح','[':'ج',']':'د',
        A:'ش',S:'س',D:'ي',F:'ب',G:'ل',H:'ا',J:'ت',K:'ن',L:'م',';':'ك',"'":'ط',
        Z:'ئ',X:'ء',C:'ؤ',V:'ر',B:'لا',N:'ى',M:'ة',',':'و','.':'ز','/':'ظ' },
      shift: { '`':'ّ','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':')','0':'(','-':'_','=':'+',
        Q:'َ',W:'ً',E:'ُ',R:'ٌ',T:'لإ',Y:'إ',U:'‘',I:'÷',O:'×',P:'؛','[':'<',']':'>',
        A:'ِ',S:'ٍ',D:']',F:'[',G:'لأ',H:'أ',J:'ـ',K:'،',L:'/',';':':',"'":'"',
        Z:'~',X:'ْ',C:'}',V:'{',B:'لآ',N:'آ',M:'’',',':',','.':'.','/':'؟' }
    },
    persian: {
      label: 'Persian — Standard 9147',
      title: 'صفحه‌کلید فارسی',
      dir: 'rtl',
      sub: 'Persian, the ISIRI 9147 standard. Note ی and ک in place of the Arabic ي and ك, and پ, چ, ژ and گ, which Arabic has no letters for. The zero-width non-joiner, which holds a compound word apart without joining it, sits on Shift with B, and on Shift with the space bar.',
      meta: ['پ — pe', 'U+067E', 'Not present in Arabic'],
      source: { mac: 'Persian', win: 'Persian (Standard)' },
      base: { '`':['‍','zwj'],'1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹','0':'۰','-':'-','=':'=',
        Q:'ض',W:'ص',E:'ث',R:'ق',T:'ف',Y:'غ',U:'ع',I:'ه',O:'خ',P:'ح','[':'ج',']':'چ',
        A:'ش',S:'س',D:'ی',F:'ب',G:'ل',H:'ا',J:'ت',K:'ن',L:'م',';':'ک',"'":'گ',
        Z:'ظ',X:'ط',C:'ز',V:'ر',B:'ذ',N:'د',M:'پ',',':'و','.':'.','/':'/' },
      shift: { '`':'÷','1':'!','2':'٬','3':'٫','4':'﷼','5':'٪','6':'×','7':'،','8':'*','9':')','0':'(','-':'ـ','=':'+',
        Q:DC+'ْ',W:DC+'ٌ',E:DC+'ٍ',R:DC+'ً',T:DC+'ُ',Y:DC+'ِ',U:DC+'َ',I:DC+'ّ',O:']',P:'[','[':'}',']':'{',
        A:'ؤ',S:'ئ',D:'ي',F:'إ',G:'أ',H:'آ',J:'ة',K:'»',L:'«',';':':',"'":'؛',
        Z:'ك',X:DC+'ٓ',C:'ژ',V:DC+'ٰ',B:['‌','zwnj'],N:DC+'ٔ',M:'ء',',':'>','.':'<','/':'؟' }
    },
    russian: {
      label: 'Russian — ЙЦУКЕН',
      title: 'Русская раскладка',
      dir: 'ltr',
      sub: 'ЙЦУКЕН. Thirty-three letters on the same key count, so the punctuation is pushed onto the shift layer.',
      meta: ['ж — zhe', 'U+0436', 'Sits where the semicolon does'],
      source: { mac: 'Russian', win: 'Russian' },
      base: { '`':'ё','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0','-':'-','=':'=',
        Q:'й',W:'ц',E:'у',R:'к',T:'е',Y:'н',U:'г',I:'ш',O:'щ',P:'з','[':'х',']':'ъ',
        A:'ф',S:'ы',D:'в',F:'а',G:'п',H:'р',J:'о',K:'л',L:'д',';':'ж',"'":'э',
        Z:'я',X:'ч',C:'с',V:'м',B:'и',N:'т',M:'ь',',':'б','.':'ю','/':'.' },
      shift: { '`':'Ё','1':'!','2':'"','3':'№','4':';','5':'%','6':':','7':'?','8':'*','9':'(','0':')','-':'_','=':'+',
        Q:'Й',W:'Ц',E:'У',R:'К',T:'Е',Y:'Н',U:'Г',I:'Ш',O:'Щ',P:'З','[':'Х',']':'Ъ',
        A:'Ф',S:'Ы',D:'В',F:'А',G:'П',H:'Р',J:'О',K:'Л',L:'Д',';':'Ж',"'":'Э',
        Z:'Я',X:'Ч',C:'С',V:'М',B:'И',N:'Т',M:'Ь',',':'Б','.':'Ю','/':',' }
    },
    bengali: {
      label: 'Bengali — InScript',
      title: 'বাংলা ইনস্ক্রিপ্ট',
      dir: 'ltr',
      sub: 'Bangla InScript. Vowel signs sit under the left hand and consonants under the right, and Shift turns each consonant into its aspirated partner: ক becomes খ, ত becomes থ, প becomes ফ. Learn the positions once and they carry across the Indic scripts, which share them.',
      meta: [DC+'্ — hôsôntô', 'U+09CD', 'On D in every InScript layout'],
      source: { mac: 'Bangla', win: 'Bangla - INSCRIPT' },
      base: { '`':'॥','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯','0':'০','-':'-','=':DC+'ৃ',
        Q:DC+'ৌ',W:DC+'ৈ',E:DC+'া',R:DC+'ী',T:DC+'ূ',Y:'ব',U:'হ',I:'গ',O:'দ',P:'জ','[':'ড',']':DC+'়',
        A:DC+'ো',S:DC+'ে',D:DC+'্',F:DC+'ি',G:DC+'ু',H:'প',J:'র',K:'ক',L:'ত',';':'চ',"'":'ট',
        X:DC+'ং',C:'ম',V:'ন',B:'ব',N:'ল',M:'স',',':',','.':'.','/':'য়' },
      shift: { '`':'অ্যা','1':'!','2':'@','3':'্র','4':'র্','5':'জ্ঞ','6':'ত্র','7':'ক্ষ','8':'শ্র','9':'(','0':')','-':DC+'ঃ','=':'ঋ',
        Q:'ঔ',W:'ঐ',E:'আ',R:'ঈ',T:'ঊ',Y:'ভ',U:'ঙ',I:'ঘ',O:'ধ',P:'ঝ','[':'ঢ',']':'ঞ',
        A:'ও',S:'এ',D:'অ',F:'ই',G:'উ',H:'ফ',J:'ৎ',K:'খ',L:'থ',';':'ছ',"'":'ঠ',
        X:DC+'ঁ',C:'ণ',M:'শ',',':'ষ','.':'।','/':'য' }
    },
    thai: {
      label: 'Thai — Kedmanee',
      title: 'แป้นพิมพ์เกษมณี',
      dir: 'ltr',
      sub: 'Thai Kedmanee. Every key is doubly occupied, with no Latin letter anywhere, which is why Thai typists switch input source rather than press Shift. The two commonest tone marks stay on the home row: mai ek on J, mai tho on H.',
      meta: ['ๆ — mai yamok', 'U+0E46', 'A repeat mark, not a letter'],
      source: { mac: 'Thai', win: 'Thai Kedmanee' },
      base: { '`':'_','1':'ๅ','2':'/','3':'-','4':'ภ','5':'ถ','6':DC+'ุ','7':DC+'ึ','8':'ค','9':'ต','0':'จ','-':'ข','=':'ช',
        Q:'ๆ',W:'ไ',E:'ำ',R:'พ',T:'ะ',Y:DC+'ั',U:DC+'ี',I:'ร',O:'น',P:'ย','[':'บ',']':'ล',
        A:'ฟ',S:'ห',D:'ก',F:'ด',G:'เ',H:DC+'้',J:DC+'่',K:'า',L:'ส',';':'ว',"'":'ง',
        Z:'ผ',X:'ป',C:'แ',V:'อ',B:DC+'ิ',N:DC+'ื',M:'ท',',':'ม','.':'ใ','/':'ฝ' },
      shift: { '`':'%','1':'+','2':'๑','3':'๒','4':'๓','5':'๔','6':DC+'ู','7':'฿','8':'๕','9':'๖','0':'๗','-':'๘','=':'๙',
        Q:'๐',W:'"',E:'ฎ',R:'ฑ',T:'ธ',Y:DC+'ํ',U:DC+'๊',I:'ณ',O:'ฯ',P:'ญ','[':'ฐ',']':',',
        A:'ฤ',S:'ฆ',D:'ฏ',F:'โ',G:'ฌ',H:DC+'็',J:DC+'๋',K:'ษ',L:'ศ',';':'ซ',"'":'.',
        Z:'(',X:')',C:'ฉ',V:'ฮ',B:DC+'ฺ',N:DC+'์',M:'?',',':'ฒ','.':'ฬ','/':'ฦ' }
    },
    georgian: {
      label: 'Georgian — QWERTY',
      title: 'ქართული კლავიატურა',
      dir: 'ltr',
      sub: 'Georgian QWERTY. Mkhedruli has thirty-three letters and the Latin keyboard has twenty-six letter keys, so Shift is not doing case here; it is doing overflow, carrying the remaining seven: ჭ ღ თ შ ჟ ძ ჩ.',
      meta: ['ღ — ghan, on Shift+R', 'U+10E6', 'The clearest case of Shift as overflow'],
      source: { mac: 'Georgian – QWERTY', win: 'Georgian (QWERTY)' },
      base: { '`':'„','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0','-':'-','=':'=',
        Q:'ქ',W:'წ',E:'ე',R:'რ',T:'ტ',Y:'ყ',U:'უ',I:'ი',O:'ო',P:'პ','[':'[',']':']',
        A:'ა',S:'ს',D:'დ',F:'ფ',G:'გ',H:'ჰ',J:'ჯ',K:'კ',L:'ლ',';':';',"'":"'",
        Z:'ზ',X:'ხ',C:'ც',V:'ვ',B:'ბ',N:'ნ',M:'მ',',':',','.':'.','/':'/' },
      shift: { '`':'“','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','0':')','-':'_','=':'+',
        W:'ჭ',R:'ღ',T:'თ','[':'{',']':'}',
        S:'შ',J:'ჟ',L:'₾',';':':',"'":'"',
        Z:'ძ',C:'ჩ',',':'<','.':'>','/':'?' }
    },
    korean: {
      label: 'Korean — Dubeolsik',
      title: '두벌식 자판',
      dir: 'ltr',
      sub: 'Dubeolsik, the two-set layout. Consonants under the left hand, vowels under the right, with ㅠ on B the one key that reaches across. Shift adds only the five tensed consonants and two vowels; every other letter key ignores it.',
      meta: ['ㅇ — ieung', 'U+3147', 'Silent as an initial, ng as a final'],
      source: { mac: '2-Set Korean', win: 'Korean, Microsoft IME' },
      base: { '`':'`','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0','-':'-','=':'=',
        Q:'ㅂ',W:'ㅈ',E:'ㄷ',R:'ㄱ',T:'ㅅ',Y:'ㅛ',U:'ㅕ',I:'ㅑ',O:'ㅐ',P:'ㅔ','[':'[',']':']',
        A:'ㅁ',S:'ㄴ',D:'ㅇ',F:'ㄹ',G:'ㅎ',H:'ㅗ',J:'ㅓ',K:'ㅏ',L:'ㅣ',';':';',"'":"'",
        Z:'ㅋ',X:'ㅌ',C:'ㅊ',V:'ㅍ',B:'ㅠ',N:'ㅜ',M:'ㅡ',',':',','.':'.','/':'/' },
      shift: { '`':'~','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','0':')','-':'_','=':'+',
        Q:'ㅃ',W:'ㅉ',E:'ㄸ',R:'ㄲ',T:'ㅆ',Y:'ㅛ',U:'ㅕ',I:'ㅑ',O:'ㅒ',P:'ㅖ','[':'{',']':'}',
        A:'ㅁ',S:'ㄴ',D:'ㅇ',F:'ㄹ',G:'ㅎ',H:'ㅗ',J:'ㅓ',K:'ㅏ',L:'ㅣ',';':':',"'":'"',
        Z:'ㅋ',X:'ㅌ',C:'ㅊ',V:'ㅍ',B:'ㅠ',N:'ㅜ',M:'ㅡ',',':'<','.':'>','/':'?' }
    }
  };

  var DRILLS = {
    arabic: [
      { t: 'العربية لغة رسمية في اثنتين وعشرين دولة.', en: 'Arabic is an official language in twenty-two countries.' },
      { t: 'يتحدث بها أكثر من أربعمائة مليون شخص.', en: 'More than four hundred million people speak it.' },
      { t: 'تكتب من اليمين إلى اليسار في سطر واحد.', en: 'It is written from right to left on a single line.' },
      { t: 'لكل جذر ثلاثي عائلة من الكلمات المرتبطة.', en: 'Every triliteral root has a family of related words.' }
    ],
    persian: [
      { t: 'فارسی زبان رسمی ایران، افغانستان و تاجیکستان است.', en: 'Persian is an official language of Iran, Afghanistan and Tajikistan.' },
      { t: 'در افغانستان آن را دری می‌نامند.', en: 'In Afghanistan it is called Dari.' },
      { t: 'فارسی با الفبای عربی نوشته می‌شود.', en: 'Persian is written with the Arabic alphabet.' },
      { t: 'چهار حرف پ، چ، ژ و گ در عربی نیست.', en: 'Four letters, pe, che, zhe and gaf, are not in Arabic.' }
    ],
    russian: [
      { t: 'Русский язык использует кириллицу.', en: 'Russian uses the Cyrillic alphabet.' },
      { t: 'В алфавите тридцать три буквы.', en: 'There are thirty-three letters in the alphabet.' },
      { t: 'Существительные изменяются по шести падежам.', en: 'Nouns change according to six cases.' },
      { t: 'Голубой и синий, это два разных цвета.', en: 'Goluboy and siniy are two different colours.' }
    ],
    bengali: [
      { t: 'বাংলা বাংলাদেশ ও পশ্চিমবঙ্গের সরকারি ভাষা।', en: 'Bangla is the official language of Bangladesh and West Bengal.' },
      { t: 'বাংলা লিপি বাম থেকে ডানে লেখা হয়।', en: 'The Bengali script is written from left to right.' },
      { t: 'প্রতিটি ব্যঞ্জনবর্ণে অ স্বর নিহিত থাকে।', en: 'Every consonant letter carries an inherent vowel.' },
      { t: 'হসন্ত দুটি ব্যঞ্জনবর্ণকে যুক্ত করে।', en: 'The hasanta joins two consonant letters.' }
    ],
    thai: [
      { t: 'ภาษาไทยเป็นภาษาราชการของประเทศไทย', en: 'Thai is the official language of Thailand.' },
      { t: 'ภาษาไทยมีเสียงวรรณยุกต์ห้าเสียง', en: 'Thai has five tones.' },
      { t: 'อักษรไทยมีพยัญชนะสี่สิบสี่ตัว', en: 'The Thai alphabet has forty-four consonant letters.' },
      { t: 'ภาษาไทยเขียนคำติดกันโดยไม่เว้นวรรค', en: 'Thai writes words joined together, without spaces.' }
    ],
    georgian: [
      { t: 'ქართული საქართველოს სახელმწიფო ენაა.', en: 'Georgian is the state language of Georgia.' },
      { t: 'ქართულ ანბანში ოცდაცამეტი ასოა.', en: 'There are thirty-three letters in the Georgian alphabet.' },
      { t: 'ქართული ინდოევროპული ენა არ არის.', en: 'Georgian is not an Indo-European language.' },
      { t: 'მხედრული უახლესი ქართული დამწერლობაა.', en: 'Mkhedruli is the newest Georgian script.' }
    ],
    korean: [
      { t: '한글은 십오 세기에 창제되었다.', en: 'Hangul was created in the fifteenth century.' },
      { t: '자음과 모음이 모여 한 음절을 이룬다.', en: 'Consonants and vowels combine to form one syllable.' },
      { t: '한국어는 남북한의 공용어이다.', en: 'Korean is the official language of both Koreas.' },
      { t: '두벌식 자판에서 자음은 왼쪽에 있다.', en: 'On the dubeolsik keyboard the consonants are on the left.' }
    ]
  };

  var KEY_ROWS = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']
  ];
  var ROW_CLASSES = ['', '', 'kb-row--home', 'kb-row--bottom'];
  var HOT_KEY = { arabic: 'R', persian: 'M', russian: ';', bengali: 'D', thai: 'Q', georgian: 'R', korean: 'D' };

  /* Bengali types য় ড় ঢ় either as one precomposed character or as the base
     letter plus a nukta, depending on the build. All three sit on Unicode's
     composition-exclusion list, so NFC will not reconcile the two forms and a
     plain comparison would reject correct typing. Both sides are held in the
     decomposed form instead. */
  function normalise(s) {
    return s
      .replace(/\u09DC/g, '\u09A1\u09BC')   /* rra  -> dda + nukta */
      .replace(/\u09DD/g, '\u09A2\u09BC')   /* rha  -> ddha + nukta */
      .replace(/\u09DF/g, '\u09AF\u09BC');  /* yya  -> ya + nukta */
  }

  var state = {
    layout: 'arabic',
    layer: 'base',
    line: 0,
    typed: '',
    scored: 0,
    composing: false,
    startedAt: null,
    elapsed: 0,
    keystrokes: 0,
    hits: 0,
    finished: false
  };

  var els = {};

  function $(sel) { return document.querySelector(sel); }

  function buildKeyboard() {
    var rows = $('[data-kbrows]');
    if (!rows) return;
    rows.innerHTML = '';
    KEY_ROWS.forEach(function (legends, i) {
      var row = document.createElement('div');
      row.className = ('kb-row ' + ROW_CLASSES[i]).trim();
      legends.forEach(function (legend) {
        var key = document.createElement('span');
        key.className = 'kb-key';
        key.dataset.legend = legend;
        key.appendChild(document.createTextNode(''));
        var small = document.createElement('small');
        small.textContent = legend;
        key.appendChild(small);
        row.appendChild(key);
      });
      rows.appendChild(row);
    });
  }

  function applyLayout() {
    var L = LAYOUTS[state.layout];
    var source = (state.layer === 'shift' && L.shift) ? L.shift : L.base;

    document.querySelectorAll('.kb-key').forEach(function (el) {
      var legend = el.dataset.legend;
      var glyph = source[legend];
      var cap = legend;
      if (Array.isArray(glyph)) { cap = glyph[1]; glyph = glyph[0]; }
      if (glyph === undefined) glyph = '';
      el.firstChild.nodeValue = glyph;
      el.lastElementChild.textContent = cap;
      el.classList.toggle('is-dead', glyph === '');
      el.classList.toggle('is-hot', legend === HOT_KEY[state.layout]);
    });

    var rows = $('[data-kbrows]');
    if (rows) rows.setAttribute('dir', L.dir);
    if (els.title) els.title.textContent = L.title;
    if (els.sub) els.sub.textContent = L.sub;
    L.meta.forEach(function (m, i) {
      var el = $('[data-kbmeta="' + i + '"]');
      if (el) el.textContent = m;
    });
    if (els.srcMac) els.srcMac.textContent = L.source.mac;
    if (els.srcWin) els.srcWin.textContent = L.source.win;

    document.querySelectorAll('[data-layoutbtn]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.layoutbtn === state.layout);
    });
    document.querySelectorAll('[data-layer]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.layer === state.layer);
    });
    var shiftBtn = $('[data-layer="shift"]');
    if (shiftBtn) shiftBtn.disabled = !L.shift;

    if (els.field) els.field.setAttribute('dir', L.dir);
    if (els.input) {
      els.input.setAttribute('dir', L.dir);
      els.input.setAttribute('lang', state.layout === 'korean' ? 'ko' : '');
    }
  }

  function drill() { return DRILLS[state.layout]; }

  function pad(v) { return v < 10 ? '0' + v : String(v); }

  function renderDrill() {
    var d = drill();
    var cur = d[state.line] || d[d.length - 1];
    var target = normalise(cur.t);
    var n = state.typed.length;

    if (els.done) els.done.textContent = state.finished ? target : target.slice(0, n);
    if (els.cursor) els.cursor.textContent = state.finished ? '' : (target[n] || '');
    if (els.rest) els.rest.textContent = state.finished ? '' : target.slice(n + 1);
    if (els.english) els.english.textContent = cur.en;
    if (els.hint) {
      els.hint.textContent = state.finished
        ? 'Four lines complete'
        : (state.startedAt ? '' : 'Click here and begin typing');
    }
    if (els.progress) {
      els.progress.textContent = state.finished
        ? 'Complete'
        : 'Line ' + (state.line + 1) + ' of ' + d.length;
    }

    var mins = state.elapsed / 60;
    if (els.clock) els.clock.textContent = pad(Math.floor(state.elapsed / 60)) + ':' + pad(Math.floor(state.elapsed % 60));
    if (els.cpm) els.cpm.textContent = mins > 0.02 ? String(Math.round(state.keystrokes / mins)) : '—';
    if (els.accuracy) els.accuracy.textContent = state.keystrokes ? Math.round((state.hits / state.keystrokes) * 100) + '%' : '—';
  }

  function renderReference() {
    var list = $('[data-drillref]');
    if (!list) return;
    list.innerHTML = '';
    drill().forEach(function (d, i) {
      var row = document.createElement('div');
      row.className = 'drill-ref-row';
      var n = document.createElement('span');
      n.className = 'drill-ref-row__n';
      n.textContent = pad(i + 1);
      var t = document.createElement('span');
      t.className = 'drill-ref-row__t';
      t.textContent = d.t;
      var en = document.createElement('span');
      en.className = 'drill-ref-row__en';
      en.textContent = d.en;
      row.appendChild(n); row.appendChild(t); row.appendChild(en);
      list.appendChild(row);
    });
  }

  function resetDrill() {
    state.line = 0;
    state.typed = '';
    state.scored = 0;
    state.composing = false;
    state.startedAt = null;
    state.elapsed = 0;
    state.keystrokes = 0;
    state.hits = 0;
    state.finished = false;
    if (els.input) els.input.value = '';
    renderDrill();
  }

  /* Characters are scored once they have settled. Under an input method the
     value of the field changes in place while a syllable is being assembled,
     so scoring waits for the composition to end rather than marking a
     half-built block as a miss. */
  function score(v, target) {
    if (v.length < state.scored) state.scored = v.length;
    while (state.scored < v.length) {
      state.keystrokes += 1;
      if (v[state.scored] === target[state.scored]) state.hits += 1;
      state.scored += 1;
    }
  }

  function advance() {
    if (state.line >= drill().length - 1) {
      state.finished = true;
      return;
    }
    state.line += 1;
    state.typed = '';
    state.scored = 0;
    els.input.value = '';
    if (state.composing) {
      /* clearing the field mid-composition leaves the input method holding a
         stale block; a blur and refocus discards it cleanly */
      state.composing = false;
      els.input.blur();
      els.input.focus();
    }
  }

  function handleInput(composing) {
    if (state.finished) return;
    var v = normalise(els.input.value);
    var target = normalise(drill()[state.line].t);
    if (!state.startedAt && v.length) state.startedAt = Date.now();
    if (!composing) score(v, target);
    state.typed = v;
    if (v === target) advance();
    renderDrill();
  }

  function pickLayout(key) {
    state.layout = key;
    if (!LAYOUTS[key].shift) state.layer = 'base';
    resetDrill();
    applyLayout();
    renderReference();
  }

  document.addEventListener('DOMContentLoaded', function () {
    els.title = $('[data-kbtitle]');
    els.sub = $('[data-kbsub]');
    els.field = $('[data-drillfield]');
    els.done = $('[data-drill-done]');
    els.cursor = $('[data-drill-cursor]');
    els.rest = $('[data-drill-rest]');
    els.english = $('[data-drill-english]');
    els.hint = $('[data-drill-hint]');
    els.progress = $('[data-drill-progress]');
    els.clock = $('[data-stat-clock]');
    els.cpm = $('[data-stat-cpm]');
    els.accuracy = $('[data-stat-accuracy]');
    els.input = $('[data-drill-input]');
    els.srcMac = $('[data-kbsource-mac]');
    els.srcWin = $('[data-kbsource-win]');

    buildKeyboard();
    applyLayout();
    renderReference();
    renderDrill();

    document.querySelectorAll('[data-layoutbtn]').forEach(function (btn) {
      btn.addEventListener('click', function () { pickLayout(btn.dataset.layoutbtn); });
    });
    document.querySelectorAll('[data-layer]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var L = LAYOUTS[state.layout];
        if (btn.dataset.layer === 'shift' && !L.shift) return;
        state.layer = btn.dataset.layer;
        applyLayout();
      });
    });
    var resetBtn = $('[data-drill-reset]');
    if (resetBtn) resetBtn.addEventListener('click', resetDrill);
    var box = $('[data-drill-box]');
    if (box) box.addEventListener('click', function () { els.input.focus(); });

    if (els.input) {
      els.input.addEventListener('compositionstart', function () { state.composing = true; });
      els.input.addEventListener('compositionend', function () {
        state.composing = false;
        handleInput(false);
      });
      els.input.addEventListener('input', function (e) {
        handleInput(state.composing || !!e.isComposing);
      });
    }

    setInterval(function () {
      if (state.startedAt && !state.finished) {
        state.elapsed = (Date.now() - state.startedAt) / 1000;
        renderDrill();
      }
    }, 200);
  });
})();
