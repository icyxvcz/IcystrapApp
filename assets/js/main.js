/* Icystrap — site behaviour */

(function () {
  "use strict";

  /*  sticky header shadow  */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /*  mobile navigation  */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /*  copy buttons  */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".copy-row");
      var code = row ? row.querySelector("code") : null;
      if (!code) return;

      var text = code.textContent.trim();
      var label = btn.querySelector(".copy-label");

      function done() {
        btn.classList.add("done");
        if (label) label.textContent = "Copied!";
        setTimeout(function () {
          btn.classList.remove("done");
          if (label) label.textContent = "Copy";
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }

      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (err) { /* ignore */ }
        document.body.removeChild(ta);
      }
    });
  });

  /*  scroll reveal  */
  var revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        setTimeout(function () { el.classList.add("in"); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealables.forEach(function (el, i) {
      if (!el.dataset.delay && el.parentElement) {
        var siblings = Array.prototype.filter.call(
          el.parentElement.children,
          function (c) { return c.classList && c.classList.contains("reveal"); }
        );
        var idx = siblings.indexOf(el);
        if (idx > 0) el.dataset.delay = String(Math.min(idx, 5) * 70);
      }
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /*  year in footer  */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });


  (function () {
    if (!window.matchMedia) return;

    // Never take the cursor away on touch/coarse-pointer devices.
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    var docEl = document.documentElement;

    var wrap = document.createElement("div");
    wrap.className = "ic-cursor";
    wrap.setAttribute("aria-hidden", "true");

    var dot = document.createElement("div");
    dot.className = "ic-cursor__dot";
    wrap.appendChild(dot);

    // Only hide the native cursor once the replacement is actually in the DOM.
    document.body.appendChild(wrap);
    docEl.classList.add("has-dot-cursor");

    var INTERACTIVE = [
      "a", "button", "summary", "select", "label",
      "[role='button']", "[role='tab']", "[role='link']",
      "input[type='checkbox']", "input[type='radio']",
      "input[type='range']", "input[type='submit']",
      "input[type='button']", "input[type='file']", "input[type='color']",
      ".copy-btn", ".nav-toggle", ".socials a",
      ".asset.active", ".switch", ".cursor-demo"
    ].join(",");

    var TEXT_ENTRY = [
      "input:not([type='checkbox']):not([type='radio']):not([type='submit'])" +
        ":not([type='button']):not([type='range']):not([type='color'])",
      "textarea",
      "[contenteditable='true']"
    ].join(",");

    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    var shown = false;
    var rafId = 0;

    function paint() {
      rafId = 0;
      wrap.style.transform =
        "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px,0)";
    }

    function schedule() {
      if (!rafId) rafId = window.requestAnimationFrame(paint);
    }

    function syncState(target) {
      var el = target && target.nodeType === 1 ? target : null;
      if (!el) return;

      // A text field still needs the native I-beam, so pause the dot there.
      if (el.closest(TEXT_ENTRY)) {
        wrap.classList.add("is-hidden");
        return;
      }
      wrap.classList.remove("is-hidden");

      var interactive = !!el.closest(INTERACTIVE);
      wrap.classList.toggle("is-interactive", interactive);
    }

    document.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;

      if (!shown) {
        shown = true;
        wrap.classList.remove("is-hidden");
      }

      syncState(e.target);
      schedule();
    }, { passive: true });

    document.addEventListener("mousedown", function () {
      wrap.classList.add("is-pressed");
    });

    document.addEventListener("mouseup", function () {
      wrap.classList.remove("is-pressed");
    });

    // Hide the dot when the pointer leaves the window entirely.
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && !e.toElement) {
        wrap.classList.add("is-hidden");
      }
    });

    window.addEventListener("blur", function () {
      wrap.classList.add("is-hidden");
    });

    window.addEventListener("resize", function () {
      x = Math.min(x, window.innerWidth);
      y = Math.min(y, window.innerHeight);
      schedule();
    }, { passive: true });
  })();

  /* latest release version */
  var versionSlots = document.querySelectorAll("[data-latest-version]");
  if (versionSlots.length && window.fetch) {
    fetch("https://api.github.com/repos/icyxvcz/Icystrap/releases/latest", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.tag_name) return;
        versionSlots.forEach(function (el) { el.textContent = data.tag_name; });
      })
      .catch(function () { /* ignore */ });
  }
})();
