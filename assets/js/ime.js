/* Aksarium — Pinyin IME demonstration.
   There is no Chinese keyboard; you type the sound in Latin letters and choose
   the character. This script is that loop, over a small demonstration
   dictionary — it is not a full IME. */

(function () {
  'use strict';

  var IME = {
    hanyu: ['汉语', '韩语', '含语'],
    shi: ['是', '时', '使', '事', '识'],
    shijie: ['世界', '时节', '世纪'],
    shang: ['上', '商', '尚', '伤'],
    shiyong: ['使用', '实用', '适用'],
    renshu: ['人数', '人属'],
    zui: ['最', '嘴', '罪'],
    zuiduo: ['最多', '最大'],
    de: ['的', '得', '地'],
    yuyan: ['语言', '预言', '寓言'],
    wo: ['我', '握', '卧'],
    xuexi: ['学习', '雪西'],
    zhongwen: ['中文', '中问'],
    pinyin: ['拼音', '品音']
  };

  var state = { buf: '', text: '' };
  var els = {};

  function candidates(buf) {
    if (!buf) return [];
    if (IME[buf]) return IME[buf];
    var keys = Object.keys(IME).filter(function (k) { return k.indexOf(buf) === 0; });
    return keys.length ? IME[keys[0]] : [];
  }

  function commit(ch) {
    state.text += ch;
    state.buf = '';
    render();
  }

  function render() {
    els.buf.textContent = state.buf || ' ';
    els.text.textContent = state.text;
    els.empty.textContent = state.text ? '' : 'Committed characters appear here';

    els.candidates.innerHTML = '';
    candidates(state.buf).slice(0, 5).forEach(function (ch, i) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ime-candidate';
      var n = document.createElement('span');
      n.className = 'ime-candidate__n';
      n.textContent = String(i + 1);
      var c = document.createElement('span');
      c.className = 'ime-candidate__ch';
      c.textContent = ch;
      chip.appendChild(n);
      chip.appendChild(c);
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        commit(ch);
        els.input.focus();
      });
      els.candidates.appendChild(chip);
    });
  }

  function onKey(e) {
    var k = e.key;
    if (/^[a-zA-Z]$/.test(k)) {
      state.buf += k.toLowerCase();
    } else if (k === 'Backspace') {
      if (state.buf) state.buf = state.buf.slice(0, -1);
      else state.text = state.text.slice(0, -1);
    } else if (/^[1-9]$/.test(k)) {
      var c = candidates(state.buf)[Number(k) - 1];
      if (c) { state.text += c; state.buf = ''; } else { return; }
    } else if (k === ' ') {
      var first = candidates(state.buf)[0];
      if (first) { state.text += first; state.buf = ''; } else { return; }
    } else if (k === 'Enter') {
      state.text += '。';
      state.buf = '';
    } else {
      return;
    }
    e.preventDefault();
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    els.buf = document.querySelector('[data-ime-buf]');
    els.text = document.querySelector('[data-ime-text]');
    els.empty = document.querySelector('[data-ime-empty]');
    els.candidates = document.querySelector('[data-ime-candidates]');
    els.input = document.querySelector('[data-ime-input]');

    var box = document.querySelector('[data-ime-box]');
    if (box) box.addEventListener('click', function () { els.input.focus(); });
    els.input.addEventListener('keydown', onKey);

    var reset = document.querySelector('[data-ime-reset]');
    if (reset) {
      reset.addEventListener('click', function () {
        state.buf = '';
        state.text = '';
        render();
      });
    }

    render();
  });
})();
