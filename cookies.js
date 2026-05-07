(function () {
  var STORAGE_KEY = "eventosGeorgeCookieConsent_v1";
  var lastFocus = null;

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveConsent(options) {
    var consent = {
      necessary: true,
      analytics: !!options.analytics,
      marketing: !!options.marketing,
      date: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    hideBanner();
    closePanel();
    applyConsent(consent);
  }

  function applyConsent(consent) {
    if (consent && consent.marketing) {
      loadExternalContent();
    } else {
      renderExternalPlaceholders();
    }
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function init() {
    keepWhatsAppVisible();
    buildBanner();
    buildPanel();
    bindFooterLinks();

    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      renderExternalPlaceholders();
      showBanner();
    }
  }

  function keepWhatsAppVisible() {
    if (document.getElementById("eg-cookie-whatsapp-visibility")) return;

    var style = document.createElement("style");
    style.id = "eg-cookie-whatsapp-visibility";
    style.textContent = 'body.eg-has-budget-form .wa[href*="wa.me"], .wa[href*="wa.me"]{display:flex!important}';
    document.head.appendChild(style);
  }

  function buildBanner() {
    if (document.getElementById("eg-cookie-banner")) return;

    var banner = document.createElement("section");
    banner.id = "eg-cookie-banner";
    banner.className = "eg-cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.hidden = true;
    banner.innerHTML =
      '<h2 class="eg-cookie-title">Preferencias de cookies</h2>' +
      '<p class="eg-cookie-text">Utilizamos cookies técnicas necesarias para el funcionamiento de la web y, solo si las aceptas, cookies de análisis o contenido externo para mejorar la experiencia. Puedes aceptar, rechazar o configurar el uso de cookies.</p>' +
      '<div class="eg-cookie-actions">' +
      '<button class="eg-cookie-btn eg-cookie-btn-primary" type="button" data-cookie-accept>Aceptar cookies</button>' +
      '<button class="eg-cookie-btn eg-cookie-btn-reject" type="button" data-cookie-reject>Rechazar cookies</button>' +
      '<button class="eg-cookie-btn eg-cookie-btn-secondary" type="button" data-cookie-config>Configurar</button>' +
      '</div>';

    document.body.appendChild(banner);
    banner.querySelector("[data-cookie-accept]").addEventListener("click", function () {
      saveConsent({ analytics: true, marketing: true });
    });
    banner.querySelector("[data-cookie-reject]").addEventListener("click", function () {
      saveConsent({ analytics: false, marketing: false });
    });
    banner.querySelector("[data-cookie-config]").addEventListener("click", openPanel);
  }

  function buildPanel() {
    if (document.getElementById("eg-cookie-modal")) return;

    var modal = document.createElement("div");
    modal.id = "eg-cookie-modal";
    modal.className = "eg-cookie-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="eg-cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="eg-cookie-panel-title">' +
      '<div class="eg-cookie-head">' +
      '<div><h2 class="eg-cookie-title" id="eg-cookie-panel-title">Configurar cookies</h2>' +
      '<p class="eg-cookie-text">Elige qué categorías quieres permitir. Puedes cambiar tu decisión más adelante desde el footer.</p></div>' +
      '<button class="eg-cookie-close" type="button" aria-label="Cerrar configuración de cookies" data-cookie-close>×</button>' +
      '</div>' +
      '<section class="eg-cookie-category"><h3>Cookies técnicas necesarias</h3><p>Necesarias para que la web funcione correctamente.</p><label class="eg-cookie-toggle"><span>Siempre activas</span><input type="checkbox" checked disabled></label></section>' +
      '<section class="eg-cookie-category"><h3>Cookies de análisis</h3><p>Sirven para conocer visitas y mejorar la web si se añade Google Analytics u otra herramienta.</p><label class="eg-cookie-toggle"><span>Desactivadas por defecto</span><input type="checkbox" data-cookie-analytics></label></section>' +
      '<section class="eg-cookie-category"><h3>Cookies de marketing o contenido externo</h3><p>Pueden usarse para cargar vídeos de YouTube, mapas, Instagram, TikTok o píxeles de publicidad.</p><label class="eg-cookie-toggle"><span>Desactivadas por defecto</span><input type="checkbox" data-cookie-marketing></label></section>' +
      '<div class="eg-cookie-modal-actions">' +
      '<button class="eg-cookie-btn eg-cookie-btn-primary" type="button" data-cookie-save>Guardar configuración</button>' +
      '<button class="eg-cookie-btn eg-cookie-btn-reject" type="button" data-cookie-accept-all>Aceptar todas</button>' +
      '<button class="eg-cookie-btn eg-cookie-btn-secondary" type="button" data-cookie-reject-all>Rechazar todas</button>' +
      '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closePanel();
    });
    modal.querySelector("[data-cookie-close]").addEventListener("click", closePanel);
    modal.querySelector("[data-cookie-save]").addEventListener("click", function () {
      saveConsent({
        analytics: modal.querySelector("[data-cookie-analytics]").checked,
        marketing: modal.querySelector("[data-cookie-marketing]").checked
      });
    });
    modal.querySelector("[data-cookie-accept-all]").addEventListener("click", function () {
      saveConsent({ analytics: true, marketing: true });
    });
    modal.querySelector("[data-cookie-reject-all]").addEventListener("click", function () {
      saveConsent({ analytics: false, marketing: false });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closePanel();
    });
  }

  function bindFooterLinks() {
    document.querySelectorAll("[data-cookie-preferences]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        openPanel();
      });
    });
  }

  function showBanner() {
    var banner = document.getElementById("eg-cookie-banner");
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    var banner = document.getElementById("eg-cookie-banner");
    if (banner) banner.hidden = true;
  }

  function openPanel() {
    var modal = document.getElementById("eg-cookie-modal");
    if (!modal) return;
    var consent = getConsent() || { analytics: false, marketing: false };
    modal.querySelector("[data-cookie-analytics]").checked = !!consent.analytics;
    modal.querySelector("[data-cookie-marketing]").checked = !!consent.marketing;
    lastFocus = document.activeElement;
    modal.hidden = false;
    var first = modal.querySelector("button, input");
    if (first) first.focus();
  }

  function closePanel() {
    var modal = document.getElementById("eg-cookie-modal");
    if (!modal) return;
    modal.hidden = true;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function renderExternalPlaceholders() {
    document.querySelectorAll("[data-cookie-src]").forEach(function (embed) {
      markVideoEmbed(embed);
      if (embed.querySelector(".cookie-embed-placeholder")) return;
      embed.innerHTML =
        '<div class="cookie-embed-placeholder">' +
        '<p>Este contenido externo puede usar cookies. Puedes verlo aceptando cookies de contenido externo.</p>' +
        '<button class="eg-cookie-btn eg-cookie-btn-primary" type="button">Aceptar y ver contenido</button>' +
        '</div>';
      embed.querySelector("button").addEventListener("click", function () {
        var consent = getConsent() || { analytics: false };
        saveConsent({ analytics: !!consent.analytics, marketing: true });
      });
    });
  }

  function loadExternalContent() {
    document.querySelectorAll("[data-cookie-src]").forEach(function (embed) {
      markVideoEmbed(embed);
      var iframe = document.createElement("iframe");
      iframe.src = embed.getAttribute("data-cookie-src");
      iframe.title = embed.getAttribute("data-cookie-title") || "Contenido externo";
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.style.cssText = "width:100%;height:100%;max-width:100%;max-height:100%;border:0;display:block;object-fit:contain;object-position:center center;background:#111;border-radius:inherit";
      embed.innerHTML = "";
      embed.appendChild(iframe);
    });
  }

  function markVideoEmbed(embed) {
    embed.classList.add("video-thumb");

    var parent = embed.parentElement;
    if (parent) parent.classList.add("video-card");
  }

  window.EventosGeorgeCookies = {
    openPreferences: openPanel,
    getConsent: getConsent
  };

  ready(init);
})();
