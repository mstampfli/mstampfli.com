/* mstampfli.com, theme toggle, boot typing, clock, reveals. no deps. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
                /\bnoanim\b/.test(location.search);
  if (reduced) document.documentElement.classList.add("no-anim");

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById("theme-toggle");
  function labelFor(theme) {
    return theme === "light" ? "[ dark_mode ]" : "[ light_mode ]";
  }
  if (toggle) {
    toggle.textContent = labelFor(document.documentElement.dataset.theme);
    toggle.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "light" ? "" : "light";
      if (next) document.documentElement.dataset.theme = next;
      else delete document.documentElement.dataset.theme;
      toggle.textContent = labelFor(next);
      try { localStorage.setItem("maka-theme", next); } catch (e) {}
    });
  }

  /* ---------- boot log typing ----------
     The full log is in the markup (works without JS); typing replays it. */
  var boot = document.getElementById("bootlog");
  if (boot && !reduced) {
    var code = boot.querySelector("code");
    var nodes = [];
    (function collect(el) {
      Array.prototype.forEach.call(el.childNodes, function (n) {
        if (n.nodeType === 3) nodes.push({ parent: el, text: n.textContent, node: n });
        else collect(n);
      });
    })(code);
    nodes.forEach(function (n) { n.node.textContent = ""; });
    var li = 0, ci = 0;
    (function type() {
      if (li >= nodes.length) return;
      var cur = nodes[li];
      ci += 1 + Math.floor(Math.random() * 2);
      cur.node.textContent = cur.text.slice(0, ci);
      if (ci >= cur.text.length) { li++; ci = 0; setTimeout(type, 90); }
      else setTimeout(type, 14);
    })();
  }

  /* ---------- clock (server lives in nbg1, CET/CEST) ---------- */
  var clock = document.getElementById("clock");
  if (clock) {
    var fmt = new Intl.DateTimeFormat("de-CH", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZone: "Europe/Zurich"
    });
    (function tick() {
      clock.textContent = fmt.format(new Date()) + " cet";
      setTimeout(tick, 1000);
    })();
  }

  /* ---------- scroll reveals ---------- */
  var revealed = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealed.forEach(function (el) { el.classList.add("is-seen"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-seen"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealed.forEach(function (el) { io.observe(el); });
  }
})();
