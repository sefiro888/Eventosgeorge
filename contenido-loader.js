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
      applyServiceImages(((content.imagenes || {})[pageName]) || []);
    })
    .catch(function (error) {
      console.warn("Contenido editable no aplicado:", error);
    });

  addAdminLink();
  addHelpChat();

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

  function applyServiceImages(images) {
    if (!images.length) return;

    var targets = Array.prototype.slice.call(document.querySelectorAll("img"))
      .filter(function (img) {
        return img.id !== "lbimg" &&
          !img.closest("#lb") &&
          !img.closest("#nav") &&
          !img.closest(".site-footer");
      });

    var filledImages = images.filter(function (item) {
      return item && item.src;
    });

    filledImages.forEach(function (item, index) {
      var target = targets[index];
      if (!target) return;
      target.src = item.src;
      target.alt = item.nombre || target.alt || "";
    });
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

  function addAdminLink() {
    var showAdmin = new URLSearchParams(window.location.search).has("editar") ||
      window.localStorage.getItem("eventosGeorgeAdmin") === "1";

    if (!showAdmin) return;

    window.localStorage.setItem("eventosGeorgeAdmin", "1");

    var link = document.createElement("a");
    link.href = "editor.html";
    link.textContent = "Editar web";
    link.style.cssText = [
      "position:fixed",
      "left:18px",
      "bottom:18px",
      "z-index:9999",
      "background:#C9A84C",
      "color:#060606",
      "font:700 12px Arial,sans-serif",
      "letter-spacing:.08em",
      "text-transform:uppercase",
      "padding:11px 14px",
      "border-radius:4px",
      "box-shadow:0 8px 24px rgba(0,0,0,.35)"
    ].join(";");
    document.addEventListener("DOMContentLoaded", function () {
      document.body.appendChild(link);
    });
  }

  function addHelpChat() {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.getElementById("eg-chat")) return;

      var style = document.createElement("style");
      style.textContent = [
        "#eg-chat{position:fixed;right:18px;bottom:88px;z-index:9998;font-family:Arial,sans-serif;color:#f8f3ec}",
        "#eg-chat-toggle{width:56px;height:56px;border-radius:50%;background:#C9A84C;color:#060606;border:0;box-shadow:0 8px 28px rgba(0,0,0,.45);font-size:24px;font-weight:700}",
        "#eg-chat-panel{display:none;position:absolute;right:0;bottom:70px;width:min(340px,calc(100vw - 28px));max-height:min(560px,calc(100vh - 120px));background:#111;border:1px solid #3a3120;border-radius:10px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.6)}",
        "#eg-chat.open #eg-chat-panel{display:flex;flex-direction:column}",
        ".eg-chat-head{background:#1b1b1b;border-bottom:1px solid #3a3120;padding:14px 16px;display:flex;justify-content:space-between;gap:12px;align-items:center}",
        ".eg-chat-title{font-size:14px;font-weight:700;color:#E8C97A}.eg-chat-sub{font-size:12px;color:#aaa;margin-top:2px}",
        ".eg-chat-close{background:transparent;border:0;color:#aaa;font-size:22px}",
        ".eg-chat-body{padding:14px;overflow:auto;display:flex;flex-direction:column;gap:10px}",
        ".eg-msg{font-size:13px;line-height:1.45;padding:10px 12px;border-radius:8px;max-width:88%}",
        ".eg-bot{background:#202020;border:1px solid #303030;align-self:flex-start}.eg-user{background:#C9A84C;color:#070707;align-self:flex-end}",
        ".eg-options{display:grid;gap:8px;padding:0 14px 14px}.eg-options button,.eg-whatsapp{background:#181818;border:1px solid #3a3120;color:#f8f3ec;padding:11px 12px;border-radius:8px;text-align:left;font-size:13px;text-decoration:none}",
        ".eg-options button:hover,.eg-whatsapp:hover{border-color:#C9A84C;color:#E8C97A}",
        ".eg-chat-foot{padding:0 14px 14px}",
        ".eg-whatsapp{display:block;background:#1f3b2a;border-color:#2f7044;color:#dfffe8;text-align:center;font-weight:700}",
        "@media(max-width:640px){#eg-chat{right:14px;bottom:84px}#eg-chat-panel{right:-4px;width:calc(100vw - 20px);max-height:68vh}#eg-chat-toggle{width:54px;height:54px}}"
      ].join("");
      document.head.appendChild(style);

      var chat = document.createElement("div");
      chat.id = "eg-chat";
      chat.innerHTML = [
        '<div id="eg-chat-panel" role="dialog" aria-label="Ayuda Eventos George">',
        '<div class="eg-chat-head"><div><div class="eg-chat-title">Ayuda rapida</div><div class="eg-chat-sub">Eventos George</div></div><button class="eg-chat-close" type="button" aria-label="Cerrar">x</button></div>',
        '<div class="eg-chat-body" id="eg-chat-body"></div>',
        '<div class="eg-options" id="eg-chat-options"></div>',
        '<div class="eg-chat-foot"><a class="eg-whatsapp" id="eg-chat-wa" target="_blank" rel="noopener">Hablar por WhatsApp</a></div>',
        '</div>',
        '<button id="eg-chat-toggle" type="button" aria-label="Abrir ayuda">?</button>'
      ].join("");
      document.body.appendChild(chat);

      var answers = [
        {
          label: "Que servicios ofreceis?",
          text: "Ofrecemos maestro de ceremonias, decoracion de eventos, sonido y luces, baby shower, bodas, photocall y organizacion integral."
        },
        {
          label: "Puedo pedir presupuesto?",
          text: "Si. Puedes pedir presupuesto sin compromiso. Lo ideal es indicar fecha, lugar, tipo de evento, numero aproximado de invitados y servicios que necesitas."
        },
        {
          label: "Trabajais solo en Malaga?",
          text: "La base esta en Malaga, pero tambien se atienden eventos en toda Andalucia segun disponibilidad."
        },
        {
          label: "Teneis sonido y luces?",
          text: "Si. Hay equipos de sonido, focos LED, maquina de humo y montaje para eventos. Para confirmar el pack adecuado conviene hablar por WhatsApp."
        },
        {
          label: "Haceis decoracion?",
          text: "Si. Se pueden preparar arcos florales, mesas, photocalls, telones, letras gigantes y decoracion personalizada segun el evento."
        },
        {
          label: "Como contacto rapido?",
          text: "Pulsa el boton de WhatsApp y escribe que tipo de evento tienes, fecha aproximada y ciudad. Jorge te respondera con una propuesta."
        }
      ];

      var body = document.getElementById("eg-chat-body");
      var options = document.getElementById("eg-chat-options");
      var toggle = document.getElementById("eg-chat-toggle");
      var close = chat.querySelector(".eg-chat-close");
      var whatsapp = document.getElementById("eg-chat-wa");
      var phone = "34666213503";
      var message = "Hola Jorge, quiero informacion sobre un evento.";

      whatsapp.href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

      function addMessage(text, who) {
        var msg = document.createElement("div");
        msg.className = "eg-msg " + (who === "user" ? "eg-user" : "eg-bot");
        msg.textContent = text;
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
      }

      function renderOptions() {
        options.innerHTML = "";
        answers.forEach(function (item) {
          var button = document.createElement("button");
          button.type = "button";
          button.textContent = item.label;
          button.addEventListener("click", function () {
            addMessage(item.label, "user");
            setTimeout(function () {
              addMessage(item.text, "bot");
            }, 180);
          });
          options.appendChild(button);
        });
      }

      toggle.addEventListener("click", function () {
        chat.classList.toggle("open");
        if (chat.classList.contains("open") && !body.children.length) {
          addMessage("Hola, soy la ayuda rapida de Eventos George. Elige una pregunta o escribe por WhatsApp.", "bot");
          renderOptions();
        }
      });
      close.addEventListener("click", function () {
        chat.classList.remove("open");
      });
    });
  }
})();
