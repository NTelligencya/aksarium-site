/* Aksarium — keyboard gallery.
   Layout data, layer switching and the typing drill.
   Drill sentences are factual statements about the language itself, each with
   an English translation; for RTL scripts the field runs dir="rtl". The point
   of the drill is comfort with direction and key placement, not speed. */

(function () {
  'use strict';

  var LAYOUTS = {
    arabic: {
      label: 'Arabic — Mac 102',
      title: 'لوحة المفاتيح العربية',
      dir: 'rtl',
      sub: 'Arabic Mac 102. Shift carries the harakat, the tanween and the lam-alef ligatures.',
      meta: ['ق — qāf', 'U+0642', 'Persian, Urdu, Pashto'],
      base: { '`':'ذ','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩','0':'٠','-':'-','=':'=',
        Q:'ض',W:'ص',E:'ث',R:'ق',T:'ف',Y:'غ',U:'ع',I:'ه',O:'خ',P:'ح','[':'ج',
        A:'ش',S:'س',D:'ي',F:'ب',G:'ل',H:'ا',J:'ت',K:'ن',L:'م',';':'ك',
        Z:'ئ',X:'ء',C:'ؤ',V:'ر',B:'لا',N:'ى',M:'ة',',':'و','.':'ز','/':'ظ' },
      shift: { '`':'ّ','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':')','0':'(','-':'_','=':'+',
        Q:'َ',W:'ً',E:'ُ',R:'ٌ',T:'لإ',Y:'إ',U:'‘',I:'÷',O:'×',P:'؛','[':'<',
        A:'ِ',S:'ٍ',D:']',F:'[',G:'لأ',H:'أ',J:'ـ',K:'،',L:'/',';':':',
        Z:'~',X:'ْ',C:'}',V:'{',B:'لآ',N:'آ',M:'’',',':',','.':'.','/':'؟' }
    },
    persian: {
      label: 'Persian — Standard 9147',
      title: 'صفحه‌کلید فارسی',
      dir: 'rtl',
      sub: 'Persian base layer. Note ی and ک in place of the Arabic ي and ك, and پ and چ, which Arabic has no letters for.',
      meta: ['پ — pe', 'U+067E', 'Not present in Arabic'],
      base: { '`':['‌','zwnj'],'1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹','0':'۰','-':'-','=':'=',
        Q:'ض',W:'ص',E:'ث',R:'ق',T:'ف',Y:'غ',U:'ع',I:'ه',O:'خ',P:'ح','[':'چ',
        A:'ش',S:'س',D:'ی',F:'ب',G:'ل',H:'ا',J:'ت',K:'ن',L:'م',';':'ک',
        Z:'ظ',X:'ط',C:'ز',V:'ر',B:'ذ',N:'د',M:'پ',',':'و','.':'.','/':'/' },
      shift: null
    },
    russian: {
      label: 'Russian — ЙЦУКЕН',
      title: 'Русская раскладка',
      dir: 'ltr',
      sub: 'ЙЦУКЕН. Thirty-three letters on the same key count, so the punctuation is pushed onto the shift layer.',
      meta: ['ж — zhe', 'U+0436', 'Sits where the semicolon does'],
      base: { '`':'ё','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','0':'0','-':'-','=':'=',
        Q:'й',W:'ц',E:'у',R:'к',T:'е',Y:'н',U:'г',I:'ш',O:'щ',P:'з','[':'х',
        A:'ф',S:'ы',D:'в',F:'а',G:'п',H:'р',J:'о',K:'л',L:'д',';':'ж',
        Z:'я',X:'ч',C:'с',V:'м',B:'и',N:'т',M:'ь',',':'б','.':'ю','/':'.' },
      shift: { '`':'Ё','1':'!','2':'"','3':'№','4':';','5':'%','6':':','7':'?','8':'*','9':'(','0':')','-':'_','=':'+',
        Q:'Й',W:'Ц',E:'У',R:'К',T:'Е',Y:'Н',U:'Г',I:'Ш',O:'Щ',P:'З','[':'Х',
        A:'Ф',S:'Ы',D:'В',F:'А',G:'П',H:'Р',J:'О',K:'Л',L:'Д',';':'Ж',
        Z:'Я',X:'Ч',C:'С',V:'М',B:'И',N:'Т',M:'Ь',',':'Б','.':'Ю','/':',' }
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
    ]
  };

  var KEY_ROWS = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '['],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']
  ];
  var ROW_CLASSES = ['', '', 'kb-row--home', 'kb-row--bottom'];
  var HOT_KEY = { arabic: 'R', persian: 'M', russian: ';' };

  var state = {
    layout: 'arabic',
    layer: 'base',
    line: 0,
    typed: '',
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

    document.querySelectorAll('[data-layoutbtn]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.layoutbtn === state.layout);
    });
    document.querySelectorAll('[data-layer]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.layer === state.layer);
    });
    var shiftBtn = $('[data-layer="shift"]');
    if (shiftBtn) shiftBtn.disabled = !L.shift;

    if (els.field) els.field.setAttribute('dir', L.dir);
    if (els.input) els.input.setAttribute('dir', L.dir);
  }

  function drill() { return DRILLS[state.layout]; }

  function pad(v) { return v < 10 ? '0' + v : String(v); }

  function renderDrill() {
    var d = drill();
    var cur = d[state.line] || d[d.length - 1];
    var n = state.typed.length;

    if (els.done) els.done.textContent = state.finished ? cur.t : cur.t.slice(0, n);
    if (els.cursor) els.cursor.textContent = state.finished ? '' : (cur.t[n] || '');
    if (els.rest) els.rest.textContent = state.finished ? '' : cur.t.slice(n + 1);
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
    state.startedAt = null;
    state.elapsed = 0;
    state.keystrokes = 0;
    state.hits = 0;
    state.finished = false;
    if (els.input) els.input.value = '';
    renderDrill();
  }

  function onType() {
    if (state.finished) return;
    var v = els.input.value;
    var target = drill()[state.line].t;
    if (!state.startedAt) state.startedAt = Date.now();
    if (v.length > state.typed.length) {
      var i = v.length - 1;
      state.keystrokes += 1;
      if (v[i] === target[i]) state.hits += 1;
    }
    state.typed = v;
    if (v === target) {
      if (state.line >= drill().length - 1) {
        state.finished = true;
      } else {
        state.line += 1;
        state.typed = '';
        els.input.value = '';
      }
    }
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
    if (els.input) els.input.addEventListener('input', onType);

    setInterval(function () {
      if (state.startedAt && !state.finished) {
        state.elapsed = (Date.now() - state.startedAt) / 1000;
        renderDrill();
      }
    }, 200);
  });
})();
