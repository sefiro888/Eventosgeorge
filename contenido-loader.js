(function () {
  var pageName = getPageName();

  fetch("contenido.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("No se pudo cargar contenido.json");
      return response.json();
    })
    .then(function (content) {
      applyGlobal(content.global || {});
      applyPage((content.paginas || {})[pageName] || {});
    })
    .catch(function (error) {
      console.warn("Contenido editable no aplicado:", error);
    });

  function getPageName() {
    var file = window.location.pathname.split("/").pop() || "index.html";
    return file.replace(".html", "") || "index";
  }

  function setText(selector, value, root) {
    if (!value) return;
    var element = (root || document).querySelector(selector);
    if (element) element.textContent = value;
  }

  function setHtml(selector, value, root) {
    if (!value) return;
    var element = (root || document).querySelector(selector);
    if (element) element.innerHTML = value;
  }

  function setMeta(name, value) {
    if (!value) return;
    var meta = document.querySelector('meta[name="' + name + '"]');
    if (meta) meta.setAttribute("content", value);
  }

  function applyGlobal(global) {
    var phoneHref = global.telefonoHref || "";
    var phoneText = global.telefono || "";
    var email = global.email || "";
    var instagramUrl = global.instagramUrl || "";
    var instagramText = global.instagramTexto || "";
    var whatsapp = global.whatsapp || "";
    var whatsappMessage = encodeURIComponent(global.whatsappMensaje || "");

    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      if (phoneHref) link.href = "tel:" + phoneHref;
      replaceLastChildText(link, phoneText);
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      if (email) link.href = "mailto:" + email;
      replaceLastChildText(link, email);
    });

    document.querySelectorAll('a[href*="instagram.com"]').forEach(function (link) {
      if (instagramUrl) link.href = instagramUrl;
      replaceLastChildText(link, instagramText);
    });

    document.querySelectorAll('a[href*="wa.me"], .wa').forEach(function (link) {
      if (whatsapp) {
        link.href = "https://wa.me/" + whatsapp + (whatsappMessage ? "?text=" + whatsappMessage : "");
      }
    });
  }

  function applyPage(page) {
    if (page.title) document.title = page.title;
    setMeta("description", page.description);

    if (pageName === "index") {
      applyIndexHero(page);
    } else {
      setText(".page-hero-ey", page.heroEyebrow);
      setHtml(".page-hero-h1", page.heroTitle);
      setText(".page-hero-sub", page.heroText);
      setHeroImage(".page-hero-bg", page.heroImage);
    }
  }

  function applyIndexHero(page) {
    var hero = document.querySelector("body > section");
    if (!hero) return;

    var eyebrow = hero.querySelector('div[style*="text-transform:uppercase"]');
    var heading = hero.querySelector("h1");
    var paragraphs = hero.querySelectorAll("p");

    if (eyebrow && page.heroEyebrow) {
      var line = eyebrow.querySelector("span");
      eyebrow.textContent = page.heroEyebrow;
      if (line) eyebrow.prepend(line);
    }
    if (heading && page.heroTitle) heading.innerHTML = page.heroTitle;
    if (paragraphs[0] && page.heroSignature) paragraphs[0].textContent = page.heroSignature;
    if (paragraphs[1] && page.heroText) paragraphs[1].textContent = page.heroText;

    if (page.heroImage) {
      var background = hero.querySelector('div[style*="background-image"]');
      if (background) background.style.backgroundImage = 'url("' + page.heroImage + '")';
    }
  }

  function setHeroImage(selector, value) {
    if (!value) return;
    var element = document.querySelector(selector);
    if (element) element.style.backgroundImage = 'url("' + value + '")';
  }

  function replaceLastChildText(link, value) {
    if (!value) return;
    var candidates = Array.prototype.slice.call(link.querySelectorAll("div, span"));
    var target = candidates.reverse().find(function (node) {
      return node.children.length === 0 && node.textContent.trim();
    });
    if (target) {
      target.textContent = value;
    } else if (!link.querySelector("img, svg")) {
      link.textContent = value;
    }
  }
})();
