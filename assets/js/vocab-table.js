/* Aksarium vocabulary table.
 *
 * Usage, on any page:
 *
 *   <link rel="stylesheet" href="../assets/css/vocab-table.css">
 *   <div class="vocab"
 *        data-vocab-src="../assets/data/vocab-russian.json"
 *        data-vocab-pivot="false"></div>
 *   <script src="../assets/js/vocab-table.js" defer></script>
 *
 * Attributes, all optional except the source:
 *   data-vocab-src         path to the JSON shard (required)
 *   data-vocab-pivot       "true" to show the Russian pivot column
 *   data-vocab-categories  comma list, e.g. "cyber,security", to restrict
 *                          the table to part of the set
 *   data-vocab-label       accessible name for the table
 *
 * The shard format is { language, code, dir, romanisation, count,
 * entries: [{ t, r, e, c, p }] } where t is the term in its own script,
 * r the romanisation, e the English gloss, c the category key and p the
 * Russian pivot.
 */
(function () {
  "use strict";

  var CATEGORIES = [
    { key: "all",      label: "All" },
    { key: "general",  label: "General" },
    { key: "cyber",    label: "Cyber & AI" },
    { key: "security", label: "Security" }
  ];

  var CHUNK = 120;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Fold diacritics so a search for "gan mao" finds "gǎn mào" and
  // "e" finds "ë". Case is folded at the same time.
  function fold(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[ʹʺʼ’]/g, "");
  }

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Write text into a cell, wrapping matches of the query in <mark>.
  // Matching runs on the folded string while the original characters are
  // what get shown, so accents and soft signs survive highlighting.
  // fold() can lengthen or shorten a character, so each original index
  // records the span it occupies in the folded string.
  function fill(cell, text, query) {
    cell.textContent = "";
    text = text == null ? "" : String(text);
    var needle = query ? fold(query.trim()) : "";
    if (!needle) { cell.textContent = text; return; }

    var f = "", starts = [];          // starts[i] = folded offset of text[i]
    for (var i = 0; i < text.length; i++) {
      starts.push(f.length);
      f += fold(text[i]);
    }
    starts.push(f.length);            // sentinel

    if (f.indexOf(needle) === -1) { cell.textContent = text; return; }

    // foldedOffset -> original index, rounded to the character that owns it
    function toOrig(off) {
      for (var j = 0; j < text.length; j++) {
        if (starts[j] <= off && off < starts[j + 1]) return j;
      }
      return text.length;
    }

    var cursor = 0, pos = 0, idx;
    while ((idx = f.indexOf(needle, pos)) !== -1) {
      var s = toOrig(idx);
      var e = toOrig(idx + needle.length - 1) + 1;
      if (s > cursor) cell.appendChild(document.createTextNode(text.slice(cursor, s)));
      var m = document.createElement("mark");
      m.textContent = text.slice(s, e);
      cell.appendChild(m);
      cursor = e;
      pos = idx + needle.length;
    }
    if (cursor < text.length) {
      cell.appendChild(document.createTextNode(text.slice(cursor)));
    }
  }

  function build(root, data) {
    var showPivot = root.getAttribute("data-vocab-pivot") === "true"
      && data.entries.some(function (e) { return e.p; });
    var hasRom = data.entries.some(function (e) { return e.r; });
    var restrict = (root.getAttribute("data-vocab-categories") || "")
      .split(",").map(function (s) { return s.trim(); }).filter(Boolean);

    var entries = data.entries.slice();
    if (restrict.length) {
      entries = entries.filter(function (e) { return restrict.indexOf(e.c) !== -1; });
    }
    entries.forEach(function (e) {
      e._f = fold([e.t, e.r || "", e.e, e.p || ""].join("  "));
    });

    var present = {};
    entries.forEach(function (e) { present[e.c] = true; });
    var chips = CATEGORIES.filter(function (c) {
      return c.key === "all" ? Object.keys(present).length > 1 : present[c.key];
    });

    root.textContent = "";
    root.removeAttribute("data-state");

    // ---- controls
    var controls = el("div", "vocab__controls");
    var searchWrap = el("div", "vocab__search");
    var input = document.createElement("input");
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "Search any script, romanisation or gloss";
    var inputId = "vocab-search-" + Math.random().toString(36).slice(2, 8);
    input.id = inputId;
    var label = el("label", "visually-hidden", "Search the vocabulary");
    label.setAttribute("for", inputId);
    label.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";
    searchWrap.appendChild(label);
    searchWrap.appendChild(input);
    controls.appendChild(searchWrap);

    var state = { q: "", cat: chips.length && chips[0].key === "all" ? "all" : (chips[0] && chips[0].key) || "all" };

    var filters = el("div", "vocab__filters");
    filters.setAttribute("role", "group");
    filters.setAttribute("aria-label", "Filter by category");
    var chipEls = chips.map(function (c) {
      var b = el("button", "vocab__chip", c.label);
      b.type = "button";
      b.setAttribute("aria-pressed", String(c.key === state.cat));
      b.addEventListener("click", function () {
        state.cat = c.key;
        chipEls.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        apply();
      });
      filters.appendChild(b);
      return b;
    });
    if (chips.length > 1) controls.appendChild(filters);

    var count = el("div", "vocab__count");
    count.setAttribute("role", "status");
    count.setAttribute("aria-live", "polite");
    controls.appendChild(count);
    root.appendChild(controls);

    // ---- table
    var scroll = el("div", "vocab__scroll");
    var table = document.createElement("table");
    table.setAttribute("aria-label",
      root.getAttribute("data-vocab-label") || (data.language + " vocabulary"));
    var thead = document.createElement("thead");
    var hrow = document.createElement("tr");
    var cols = [{ t: data.language, c: "vocab__col-term" }];
    if (hasRom) cols.push({ t: "Romanisation", c: "vocab__col-rom" });
    cols.push({ t: "English", c: "vocab__col-gloss" });
    if (showPivot) cols.push({ t: "Russian", c: "vocab__col-pivot" });
    cols.forEach(function (c) {
      var th = el("th", c.c, c.t);
      th.scope = "col";
      hrow.appendChild(th);
    });
    thead.appendChild(hrow);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    scroll.appendChild(table);
    var sentinel = el("div", "vocab__sentinel");
    scroll.appendChild(sentinel);
    root.appendChild(scroll);

    if (data.note) root.appendChild(el("p", "vocab__note", data.note));

    // ---- rendering
    var filtered = entries, rendered = 0;

    function row(e) {
      var tr = document.createElement("tr");
      var td = el("td", "vocab__term");
      td.lang = data.code;
      if (data.dir === "rtl") td.dir = "rtl";
      fill(td, e.t, state.q);
      tr.appendChild(td);
      if (hasRom) {
        var tdr = el("td", "vocab__rom");
        fill(tdr, e.r || "", state.q);
        tr.appendChild(tdr);
      }
      var tdg = el("td", "vocab__gloss");
      fill(tdg, e.e, state.q);
      tr.appendChild(tdg);
      if (showPivot) {
        var tdp = el("td", "vocab__pivot");
        tdp.lang = "ru";
        fill(tdp, e.p || "", state.q);
        tr.appendChild(tdp);
      }
      return tr;
    }

    function renderMore() {
      var slice = filtered.slice(rendered, rendered + CHUNK);
      if (!slice.length) return;
      var frag = document.createDocumentFragment();
      slice.forEach(function (e) { frag.appendChild(row(e)); });
      tbody.appendChild(frag);
      rendered += slice.length;
    }

    function apply() {
      var q = state.q.trim();
      var nq = fold(q);
      filtered = entries.filter(function (e) {
        if (state.cat !== "all" && e.c !== state.cat) return false;
        return !nq || e._f.indexOf(nq) !== -1;
      });
      tbody.textContent = "";
      rendered = 0;
      renderMore();
      count.textContent = filtered.length === entries.length
        ? filtered.length + " entries"
        : filtered.length + " of " + entries.length;
      var old = root.querySelector(".vocab__empty");
      if (old) old.remove();
      if (!filtered.length) {
        var empty = el("div", "vocab__empty", "Nothing matches that search.");
        scroll.appendChild(empty);
      }
      scroll.scrollTop = 0;
    }

    var timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = input.value; apply(); }, 120);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (obs) {
        if (obs.some(function (o) { return o.isIntersecting; })) renderMore();
      }, { root: scroll, rootMargin: "300px" }).observe(sentinel);
    } else {
      scroll.addEventListener("scroll", function () {
        if (scroll.scrollTop + scroll.clientHeight > scroll.scrollHeight - 300) renderMore();
      });
    }

    apply();
  }

  function init(root) {
    var src = root.getAttribute("data-vocab-src");
    if (!src) return;
    root.setAttribute("data-state", "loading");
    fetch(src, { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status + " " + r.statusText);
        return r.json();
      })
      .then(function (data) { build(root, data); })
      .catch(function (err) {
        root.removeAttribute("data-state");
        root.textContent = "";
        var box = el("div", "vocab__error",
          "The vocabulary could not be loaded (" + err.message + ").");
        root.appendChild(box);
      });
  }

  function boot() {
    document.querySelectorAll(".vocab[data-vocab-src]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
