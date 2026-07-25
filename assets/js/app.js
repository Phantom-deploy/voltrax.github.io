/* ==========================================================================
   Voltrax EV — application logic
   Navigation, reveal animations, data-driven rendering, filtering, modal,
   and WhatsApp/email inquiry composition (no backend required).
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VOLTRAX;
  var i18n = V.i18nApi;
  var pick = i18n.pick;

  var WA_NUMBER = "50760139901";
  var EMAIL = "andres@voltrax-ev.com";
  var IMG = "assets/img/";

  function waLink(text) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  }
  function mailLink(subject, body) {
    return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) +
           "&body=" + encodeURIComponent(body);
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  var ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.6 14.2c-.24.67-1.4 1.3-1.93 1.34-.5.05-1.13.07-1.83-.11a10.6 10.6 0 0 1-1.66-.62c-2.92-1.26-4.83-4.2-4.98-4.4-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.58-.37.78-.37l.56.01c.18 0 .42-.07.66.5.24.58.82 2 .9 2.15.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.3.38-.44.5-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.7-.17 1.37Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="1.8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.5c-1.3.1-2.5-.3-3.6-1v6.1a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.6a2.9 2.9 0 1 0 2 2.8V3h2.7Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  /* icon set for the advantages grid (index maps to why.1..6) */
  var WHY_ICONS = [ICON.check, ICON.check, ICON.check, ICON.check, ICON.wa, ICON.pin];

  /* --------------------------------------------------------------- header */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    var toggle = document.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      document.querySelectorAll(".nav-mobile a").forEach(function (a) {
        a.addEventListener("click", function () {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () { i18n.setLang(b.dataset.lang); });
      b.setAttribute("aria-pressed", String(b.dataset.lang === i18n.lang));
    });
  }

  /* -------------------------------------------------------------- reveal */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  }

  /* observe newly injected reveal nodes */
  function revealNow(container) {
    container.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------------------------------------------------------- bike cards */
  function highlightHTML(h) {
    return '<div class="spec-item"><div class="k">' + pick(h.k) + '</div><div class="v">' + pick(h.v) + "</div></div>";
  }

  function bikeCard(bike) {
    var inStock = bike.availability === "in-stock";
    var badge = inStock
      ? '<span class="badge badge--stock"><span class="dot"></span>' + i18n.t("badge.inStock") + "</span>"
      : '<span class="badge badge--import"><span class="dot"></span>' + i18n.t("badge.import") + "</span>";

    var card = el("article", "bike-card reveal");
    card.innerHTML =
      '<div class="bike-card__stage">' +
        '<div class="bike-card__badges">' + badge + "</div>" +
        '<img class="bike-card__img" loading="lazy" decoding="async" width="800" height="516" ' +
          'src="' + IMG + "bikes/" + bike.img + '@800.webp" alt="' + pick(bike.imgAlt) + '">' +
      "</div>" +
      '<div class="bike-card__body">' +
        '<div class="bike-card__title"><h3>' + bike.brand + " " + bike.name + "</h3></div>" +
        '<p class="bike-card__tag">' + pick(bike.tagline) + "</p>" +
        '<div class="bike-card__spec">' + bike.highlights.map(highlightHTML).join("") + "</div>" +
        '<div class="bike-card__foot">' +
          '<button class="btn btn--dark btn--sm" data-specs="' + bike.id + '">' + i18n.t("cta.viewSpecs") + "</button>" +
          '<a class="btn btn--primary btn--sm" href="' + waLink(bikeMsg(bike)) + '" target="_blank" rel="noopener">' + i18n.t("cta.inquireBike") + "</a>" +
        "</div>" +
      "</div>";
    return card;
  }

  function bikeMsg(bike) {
    return i18n.lang === "es"
      ? "Hola Voltrax, me interesa la " + bike.brand + " " + bike.name + ". ¿Está disponible?"
      : "Hi Voltrax, I'm interested in the " + bike.brand + " " + bike.name + ". Is it available?";
  }

  /* ------------------------------------------------- featured (home) grid */
  function renderFeatured() {
    var grid = document.getElementById("featuredGrid");
    if (!grid) return;
    grid.innerHTML = "";
    V.bikes.filter(function (b) { return b.availability === "in-stock"; })
      .forEach(function (b, i) {
        var c = bikeCard(b);
        c.setAttribute("data-delay", String((i % 3) + 1));
        grid.appendChild(c);
      });
    revealNow(grid);
  }

  /* -------------------------------------------------------- bikes page */
  var bikeState = { type: "all", avail: "all", sort: "featured" };

  function renderBikesPage() {
    var grid = document.getElementById("bikeGrid");
    if (!grid) return;

    var list = V.bikes.slice();
    if (bikeState.type !== "all") list = list.filter(function (b) { return b.category === bikeState.type; });
    if (bikeState.avail !== "all") list = list.filter(function (b) { return b.availability === bikeState.avail; });

    if (bikeState.sort !== "featured") {
      var key = bikeState.sort; // top | range | power
      list.sort(function (a, b) {
        var av = a.sort[key], bv = b.sort[key];
        if (av == null) return 1;
        if (bv == null) return -1;
        return bv - av;
      });
    }

    grid.innerHTML = "";
    if (!list.length) {
      grid.appendChild(el("div", "empty-state", i18n.t("bikespage.empty")));
    } else {
      list.forEach(function (b, i) {
        var c = bikeCard(b);
        c.setAttribute("data-delay", String((i % 3) + 1));
        grid.appendChild(c);
      });
      revealNow(grid);
    }

    var count = document.getElementById("resultCount");
    if (count) count.textContent = list.length + " " + i18n.t("bikespage.count");
  }

  function initBikeFilters() {
    var bar = document.getElementById("filters");
    if (!bar) return;

    // Build type chips only for categories present in data
    var typeWrap = document.getElementById("typeChips");
    var present = {};
    V.bikes.forEach(function (b) { present[b.category] = true; });
    var order = ["all", "offroad", "supermoto", "mini"];
    order.forEach(function (cat) {
      if (cat !== "all" && !present[cat]) return;
      var b = el("button", "chip");
      b.dataset.type = cat;
      b.textContent = i18n.t("filters." + cat);
      b.setAttribute("data-i18n", "filters." + cat);
      b.setAttribute("aria-pressed", String(cat === bikeState.type));
      b.addEventListener("click", function () {
        bikeState.type = cat;
        typeWrap.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
        renderBikesPage();
      });
      typeWrap.appendChild(b);
    });

    document.querySelectorAll("#availChips .chip").forEach(function (b) {
      b.addEventListener("click", function () {
        bikeState.avail = b.dataset.avail;
        document.querySelectorAll("#availChips .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
        renderBikesPage();
      });
    });

    var sortSel = document.getElementById("sortSelect");
    if (sortSel) sortSel.addEventListener("change", function () { bikeState.sort = sortSel.value; renderBikesPage(); });
  }

  /* --------------------------------------------------------------- modal */
  var lastFocus = null;
  function buildModal() {
    if (document.getElementById("bikeModal")) return;
    var m = el("div", "modal");
    m.id = "bikeModal";
    m.setAttribute("role", "dialog");
    m.setAttribute("aria-modal", "true");
    m.setAttribute("aria-labelledby", "bikeModalTitle");
    m.innerHTML =
      '<div class="modal__scrim" data-close></div>' +
      '<div class="modal__panel">' +
        '<button class="modal__close" data-close aria-label="Close">' + ICON.close + "</button>" +
        '<div class="modal__grid">' +
          '<div class="modal__media"><img id="modalImg" alt="" width="800" height="516"></div>' +
          '<div class="modal__body" id="modalBody"></div>' +
        "</div>" +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  function openBikeModal(id) {
    var bike = V.bikes.filter(function (b) { return b.id === id; })[0];
    if (!bike) return;
    buildModal();
    var m = document.getElementById("bikeModal");
    var img = document.getElementById("modalImg");
    img.src = IMG + "bikes/" + bike.img + ".webp";
    img.alt = pick(bike.imgAlt);

    var inStock = bike.availability === "in-stock";
    var badge = inStock
      ? '<span class="badge badge--stock"><span class="dot"></span>' + i18n.t("modal.availIn") + "</span>"
      : '<span class="badge badge--import"><span class="dot"></span>' + i18n.t("modal.availImp") + "</span>";

    var finishes = "";
    if (bike.finishes && bike.finishes.length) {
      finishes = '<div class="finish-swatches">' +
        bike.finishes.map(function (f) {
          return '<span class="swatch"><i style="background:' + f.hex + '"></i>' + pick(f.name) + "</span>";
        }).join("") + "</div>";
    }

    var rows = bike.specs.map(function (s) {
      return "<tr><th>" + pick(s.k) + "</th><td>" + pick(s.v) + "</td></tr>";
    }).join("");

    document.getElementById("modalBody").innerHTML =
      '<div style="margin-bottom:14px">' + badge + "</div>" +
      '<h2 class="h2" id="bikeModalTitle" style="margin-bottom:6px">' + bike.brand + " " + bike.name + "</h2>" +
      '<p class="muted" style="margin-bottom:16px">' + pick(bike.blurb) + "</p>" +
      (bike.finishes ? '<div class="eyebrow" style="margin-top:6px">' + i18n.t("modal.finishes") + "</div>" + finishes : "") +
      '<h3 class="eyebrow" style="margin:22px 0 10px">' + i18n.t("modal.specs") + "</h3>" +
      '<table class="spec-table"><tbody>' + rows + "</tbody></table>" +
      '<p class="form-note" style="margin:14px 0 20px">' + i18n.t("modal.source") + ' <a class="link-arrow" style="font-weight:600" href="' + bike.source.url + '" target="_blank" rel="noopener">' + bike.source.label + "</a></p>" +
      '<div class="btn-row">' +
        '<a class="btn btn--primary" href="' + waLink(bikeMsg(bike)) + '" target="_blank" rel="noopener">' + ICON.wa + i18n.t("cta.inquireBike") + "</a>" +
        '<a class="btn btn--ghost" href="' + mailLink("Voltrax EV — " + bike.brand + " " + bike.name, bikeMsg(bike)) + '">' + i18n.t("cta.emailInstead") + "</a>" +
      "</div>";

    lastFocus = document.activeElement;
    m.classList.add("is-open");
    document.body.style.overflow = "hidden";
    m.querySelector(".modal__close").focus();
    m.dataset.bikeId = id;
  }

  function closeModal() {
    var m = document.getElementById("bikeModal");
    if (!m || !m.classList.contains("is-open")) return;
    m.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  /* click delegation for spec buttons (works for injected cards) */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-specs]");
    if (t) { e.preventDefault(); openBikeModal(t.getAttribute("data-specs")); }
  });

  /* ---------------------------------------------------------------- parts */
  function partCard(p) {
    var msg = i18n.lang === "es"
      ? "Hola Voltrax, quiero preguntar por este repuesto: " + pick(p.name) + "."
      : "Hi Voltrax, I'd like to ask about this part: " + pick(p.name) + ".";
    var card = el("article", "part-card reveal");
    card.innerHTML =
      '<div class="part-card__img"><img loading="lazy" decoding="async" width="500" height="375" ' +
        'src="' + IMG + "parts/" + p.img + '@500.webp" alt="' + pick(p.name) + '"></div>' +
      '<div class="part-card__body">' +
        '<span class="part-card__brand">' + p.brand + "</span>" +
        "<h3>" + pick(p.name) + "</h3>" +
        "<p>" + pick(p.desc) + "</p>" +
        '<a class="btn btn--ghost btn--sm" href="' + waLink(msg) + '" target="_blank" rel="noopener">' + i18n.t("part.inquire") + "</a>" +
      "</div>";
    return card;
  }

  function renderParts() {
    var full = document.getElementById("partsGrid");
    if (full) {
      full.innerHTML = "";
      V.parts.forEach(function (p, i) {
        var c = partCard(p);
        c.setAttribute("data-delay", String((i % 4) + 1));
        full.appendChild(c);
      });
      revealNow(full);
    }
    var teaser = document.getElementById("partsTeaserGrid");
    if (teaser) {
      teaser.innerHTML = "";
      V.parts.slice(0, 4).forEach(function (p, i) {
        var c = partCard(p);
        c.setAttribute("data-delay", String((i % 4) + 1));
        teaser.appendChild(c);
      });
      revealNow(teaser);
    }
  }

  /* --------------------------------------------------------- advantages */
  function decorateWhyIcons() {
    document.querySelectorAll("[data-why-ico]").forEach(function (n) {
      var idx = parseInt(n.getAttribute("data-why-ico"), 10);
      n.innerHTML = WHY_ICONS[idx] || ICON.check;
    });
  }

  /* --------------------------------------------------------- import cta */
  function initImportCta() {
    document.querySelectorAll("[data-import-cta]").forEach(function (a) {
      var set = function () {
        var msg = i18n.lang === "es"
          ? "Hola Voltrax, quiero importar un modelo específico. Detalles:"
          : "Hi Voltrax, I'd like to import a specific model. Details:";
        a.href = waLink(msg);
      };
      set();
      document.addEventListener("voltrax:lang", set);
    });
  }

  /* ------------------------------------------------------- contact form */
  function initForm() {
    var form = document.getElementById("inquiryForm");
    if (!form) return;
    var populate = function () {
      // preselect model dropdown from ?bike= param if present
      var sel = form.querySelector('[name="interest"]');
      var params = new URLSearchParams(location.search);
      var pre = params.get("bike");
      if (pre && sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === pre) { sel.selectedIndex = i; break; }
        }
      }
    };
    populate();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.name_.value || "").trim();
      var contact = (form.contact_.value || "").trim();
      var interestSel = form.interest;
      var interest = interestSel.options[interestSel.selectedIndex].text;
      var message = (form.message_.value || "").trim();

      var lines = i18n.lang === "es"
        ? ["Hola Voltrax, quiero enviar una consulta.",
           "Nombre: " + name, "Contacto: " + contact, "Interés: " + interest, "Mensaje: " + message]
        : ["Hi Voltrax, I'd like to send an inquiry.",
           "Name: " + name, "Contact: " + contact, "Interested in: " + interest, "Message: " + message];
      var body = lines.filter(function (l) { return l.indexOf(": ") === -1 || l.split(": ")[1]; }).join("\n");

      window.open(waLink(body), "_blank", "noopener");
    });

    var emailBtn = document.getElementById("emailInstead");
    if (emailBtn) {
      emailBtn.addEventListener("click", function () {
        var subject = i18n.lang === "es" ? "Consulta — Voltrax EV" : "Inquiry — Voltrax EV";
        var body = (form.message_.value || "").trim();
        location.href = mailLink(subject, body);
      });
    }
  }

  /* ----------------------------------------------- active nav highlight */
  function initActiveNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === path) a.classList.add("is-active");
    });
  }

  /* ---- year ---- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------- theme */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function applyTheme(theme, persist) {
    theme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    if (persist !== false) { try { localStorage.setItem("voltrax-theme", theme); } catch (e) {} }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", theme === "dark" ? "#14120D" : "#16130E");
    document.querySelectorAll("[data-theme-opt]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.themeOpt === theme));
    });
  }
  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(currentTheme() === "dark" ? "light" : "dark");
      });
    });
  }

  /* ----------------------------------------------------- onboarding popup */
  function syncOnboard(pop) {
    pop.querySelectorAll("[data-onboard-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.onboardLang === i18n.lang));
    });
    pop.querySelectorAll("[data-theme-opt]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.themeOpt === currentTheme()));
    });
  }
  function closeOnboard(pop) {
    try { localStorage.setItem("voltrax-onboarded", "1"); } catch (e) {}
    i18n.setLang(i18n.lang);          // persist language (default es if untouched)
    applyTheme(currentTheme());        // persist theme (default light if untouched)
    pop.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function initOnboarding() {
    var onboarded = false;
    try { onboarded = localStorage.getItem("voltrax-onboarded") === "1"; } catch (e) {}
    var pop = document.getElementById("onboard");
    if (!pop || onboarded) return;

    pop.querySelectorAll("[data-onboard-lang]").forEach(function (b) {
      b.addEventListener("click", function () { i18n.setLang(b.dataset.onboardLang); syncOnboard(pop); });
    });
    pop.querySelectorAll("[data-theme-opt]").forEach(function (b) {
      b.addEventListener("click", function () { applyTheme(b.dataset.themeOpt); });
    });
    var done = pop.querySelector("[data-onboard-done]");
    if (done) done.addEventListener("click", function () { closeOnboard(pop); });
    pop.querySelector(".onboard__scrim").addEventListener("click", function () { closeOnboard(pop); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && pop.classList.contains("is-open")) closeOnboard(pop);
    });

    syncOnboard(pop);
    pop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var firstBtn = pop.querySelector("[data-onboard-lang]");
    if (firstBtn) { try { firstBtn.focus(); } catch (e) {} }
  }

  /* --------------------------------------------------------------- boot */
  function boot() {
    initHeader();
    initActiveNav();
    decorateWhyIcons();
    renderFeatured();
    renderParts();
    initBikeFilters();
    renderBikesPage();
    initImportCta();
    initForm();
    initYear();
    initThemeToggle();
    initReveal();
    i18n.setLang(i18n.lang); // paint translations + set toggle state
    applyTheme(currentTheme(), false); // sync meta + popup seg state (no persist)
    initOnboarding();

    // Re-render data-driven content when language changes
    document.addEventListener("voltrax:lang", function () {
      renderFeatured();
      renderParts();
      renderBikesPage();
      var m = document.getElementById("bikeModal");
      if (m && m.classList.contains("is-open")) openBikeModal(m.dataset.bikeId);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
