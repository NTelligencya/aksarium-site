/* Aksarium cross-language domain vocabulary table.
 *
 * Companion to vocab-table.js. That one reads a single-language shard and
 * shows one script; this one reads the wide shard and puts any number of
 * languages beside each other.
 *
 *   <link rel="stylesheet" href="../assets/css/vocab-table.css">
 *   <div class="domain"
 *        data-domain-src="../assets/data/vocab-domain.json"
 *        data-domain-default="russian,arabic,persian-dari,bahasa-indonesia,bengali"></div>
 *   <script src="../assets/js/domain-table.js" defer></script>
 *
 * Shard format: { count, languages: { slug: {label, code, dir, en, rom} },
 * entries: [{ c, e, <slug>: { t, r } }] }. English is always shown; it is
 * the gloss the whole set was assembled around.
 */
(function () {
  "use strict";

  var CATEGORIES = [
    { key: "all", label: "All" },
    { key: "cyber", label: "Cyber & AI" },
    { key: "security", label: "Security" }
  ];

  var CHUNK = 60;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function fold(s) {
    return String(s).toLowerCase().normalize("NFD")
      .replace(/[̀-ͯ]/g, "").replace(/[ʹʺʼ’]/g, "");
  }

  function fill(cell, text, query) {
    cell.textContent = "";
    text = text == null ? "" : String(text);
    var needle = query ? fold(query.trim()) : "";
    if (!needle) { cell.textContent = text; return; }
    var f = "", starts = [];
    for (var i = 0; i < text.length; i++) { starts.push(f.length); f += fold(text[i]); }
    starts.push(f.length);
    if (f.indexOf(needle) === -1) { cell.textContent = text; return; }
    function toOrig(off) {
      for (var j = 0; j < text.length; j++) {
        if (starts[j] <= off && off < starts[j + 1]) return j;
      }
      return text.length;
    }
    var cursor = 0, pos = 0, idx;
    while ((idx = f.indexOf(needle, pos)) !== -1) {
      var s = toOrig(idx), e = toOrig(idx + needle.length - 1) + 1;
      if (s > cursor) cell.appendChild(document.createTextNode(text.slice(cursor, s)));
      var m = document.createElement("mark");
      m.textContent = text.slice(s, e);
      cell.appendChild(m);
      cursor = e;
      pos = idx + needle.length;
    }
    if (cursor < text.length) cell.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function build(root, data) {
    var slugs = Object.keys(data.languages);
    var requested = (root.getAttribute("data-domain-default") || "")
      .split(",").map(function (s) { return s.trim(); })
      .filter(function (s) { return slugs.indexOf(s) !== -1; });
    var chosen = {};
    (requested.length ? requested : slugs.slice(0, 4)).forEach(function (s) { chosen[s] = true; });

    var entries = data.entries.slice();
    entries.forEach(function (e) {
      var parts = [e.e];
      slugs.forEach(function (s) {
        if (!e[s]) return;
        parts.push(e[s].t);
        if (e[s].r) parts.push(e[s].r);
      });
      e._f = fold(parts.join("  "));
    });

    var state = { q: "", cat: "all", rom: true };

    root.textContent = "";
    root.removeAttribute("data-state");

    // ------------------------------------------------------- row one
    var controls = el("div", "vocab__controls");

    var searchWrap = el("div", "vocab__search");
    var input = document.createElement("input");
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "Search all eleven languages at once";
    input.id = "domain-search";
    var lab = el("label", null, "Search the domain vocabulary");
    lab.setAttribute("for", "domain-search");
    lab.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";
    searchWrap.appendChild(lab);
    searchWrap.appendChild(input);
    controls.appendChild(searchWrap);

    var filters = el("div", "vocab__filters");
    filters.setAttribute("role", "group");
    filters.setAttribute("aria-label", "Filter by category");
    var catChips = CATEGORIES.map(function (c) {
      var b = el("button", "vocab__chip", c.label);
      b.type = "button";
      b.setAttribute("aria-pressed", String(c.key === state.cat));
      b.addEventListener("click", function () {
        state.cat = c.key;
        catChips.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        apply();
      });
      filters.appendChild(b);
      return b;
    });
    controls.appendChild(filters);

    var romToggle = el("button", "vocab__chip", "Romanisation");
    romToggle.type = "button";
    romToggle.setAttribute("aria-pressed", "true");
    romToggle.addEventListener("click", function () {
      state.rom = !state.rom;
      romToggle.setAttribute("aria-pressed", String(state.rom));
      rebuild();
    });
    controls.appendChild(romToggle);

    var count = el("div", "vocab__count");
    count.setAttribute("role", "status");
    count.setAttribute("aria-live", "polite");
    controls.appendChild(count);
    root.appendChild(controls);

    // ------------------------------------------------------- row two
    var picker = el("div", "domain__picker");
    picker.setAttribute("role", "group");
    picker.setAttribute("aria-label", "Choose which languages to show");
    picker.appendChild(el("span", "domain__picker-label", "Columns"));
    var langChips = slugs.map(function (s) {
      var b = el("button", "vocab__chip", data.languages[s].en);
      b.type = "button";
      b.setAttribute("aria-pressed", String(!!chosen[s]));
      b.addEventListener("click", function () {
        // never let the last column be switched off
        if (chosen[s] && Object.keys(chosen).filter(function (k) { return chosen[k]; }).length === 1) return;
        chosen[s] = !chosen[s];
        b.setAttribute("aria-pressed", String(!!chosen[s]));
        rebuild();
      });
      picker.appendChild(b);
      return b;
    });
    var allBtn = el("button", "vocab__chip domain__all", "Show all");
    allBtn.type = "button";
    allBtn.addEventListener("click", function () {
      var everyOn = slugs.every(function (s) { return chosen[s]; });
      slugs.forEach(function (s, i) {
        chosen[s] = everyOn ? i < 4 : true;
        langChips[i].setAttribute("aria-pressed", String(!!chosen[s]));
      });
      allBtn.textContent = everyOn ? "Show all" : "Show fewer";
      rebuild();
    });
    picker.appendChild(allBtn);
    root.appendChild(picker);

    // -------------------------------------------------------- table
    var viewport = el("div", "domain__viewport");
    var scroll = el("div", "vocab__scroll domain__scroll");
    var table = document.createElement("table");
    table.className = "domain__table";
    table.setAttribute("aria-label", "Cyber and security vocabulary across languages");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);
    scroll.appendChild(table);
    var sentinel = el("div", "vocab__sentinel");
    scroll.appendChild(sentinel);
    viewport.appendChild(scroll);
    root.appendChild(viewport);

    // The table is wider than the screen once more than three or four
    // languages are on, so mark which way it can still be scrolled.
    function edges() {
      var more = scroll.scrollWidth - scroll.clientWidth - scroll.scrollLeft > 2;
      viewport.classList.toggle("is-more-right", more);
      viewport.classList.toggle("is-more-left", scroll.scrollLeft > 2);
    }
    scroll.addEventListener("scroll", edges);
    if ("ResizeObserver" in window) new ResizeObserver(edges).observe(scroll);

    var note = el("p", "vocab__note");
    root.appendChild(note);

    var filtered = entries, rendered = 0, active = [];

    function activeSlugs() {
      return slugs.filter(function (s) { return chosen[s]; });
    }

    function header() {
      thead.textContent = "";
      var tr = document.createElement("tr");
      var th0 = el("th", "domain__col-en", "English");
      th0.scope = "col";
      tr.appendChild(th0);
      active.forEach(function (s) {
        var meta = data.languages[s];
        var th = el("th", meta.dir === "rtl" ? "domain__th--rtl" : null);
        th.scope = "col";
        var name = el("span", "domain__th-name", meta.label);
        name.lang = meta.code;
        if (meta.dir === "rtl") name.dir = "rtl";
        th.appendChild(name);
        th.appendChild(el("span", "domain__th-en", meta.en));
        tr.appendChild(th);
      });
      thead.appendChild(tr);
    }

    function row(e) {
      var tr = document.createElement("tr");
      var td0 = el("td", "domain__en");
      fill(td0, e.e, state.q);
      tr.appendChild(td0);
      active.forEach(function (s) {
        var meta = data.languages[s];
        var cell = e[s] || {};
        var td = el("td", "domain__cell");
        var term = el("div", "vocab__term");
        term.lang = meta.code;
        if (meta.dir === "rtl") term.dir = "rtl";
        fill(term, cell.t || "", state.q);
        td.appendChild(term);
        if (state.rom && cell.r) {
          var rom = el("div", "vocab__rom");
          fill(rom, cell.r, state.q);
          td.appendChild(rom);
        }
        tr.appendChild(td);
      });
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
      var nq = fold(state.q.trim());
      filtered = entries.filter(function (e) {
        if (state.cat !== "all" && e.c !== state.cat) return false;
        return !nq || e._f.indexOf(nq) !== -1;
      });
      tbody.textContent = "";
      rendered = 0;
      renderMore();
      count.textContent = filtered.length === entries.length
        ? filtered.length + " terms"
        : filtered.length + " of " + entries.length;
      var old = root.querySelector(".vocab__empty");
      if (old) old.remove();
      if (!filtered.length) scroll.appendChild(el("div", "vocab__empty", "Nothing matches that search."));
      scroll.scrollTop = 0;
    }

    function rebuild() {
      active = activeSlugs();
      header();
      apply();
      // A Latin-script language has no romanisation because it needs none;
      // that is not the same gap as Arabic and Persian, so say so separately.
      var automated = active.filter(function (s) {
        return data.languages[s].rom && s !== "russian";
      });
      var missing = active.filter(function (s) {
        return !data.languages[s].rom && !data.languages[s].latin;
      });
      function names(list) {
        var n = list.map(function (s) { return data.languages[s].en; });
        return n.length < 2 ? n.join("") : n.slice(0, -1).join(", ") + " and " + n[n.length - 1];
      }
      var bits = [];
      if (state.rom && chosen.russian) {
        bits.push("Russian romanisation follows BGN/PCGN 1947; stress is not marked.");
      }
      if (state.rom && automated.length) {
        bits.push("Romanisation for " + names(automated)
          + " is machine-generated and has not been checked by a speaker.");
      }
      if (missing.length) {
        bits.push("No romanisation for " + names(missing)
          + "; the source text is unvocalised, so a mechanical transliteration would give consonants only.");
      }
      note.textContent = bits.join(" ");
      edges();
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

    rebuild();
  }

  function init(root) {
    var src = root.getAttribute("data-domain-src");
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
        root.appendChild(el("div", "vocab__error",
          "The vocabulary could not be loaded (" + err.message + ")."));
      });
  }

  function boot() {
    document.querySelectorAll(".domain[data-domain-src]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
