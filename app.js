/* =========================================================
   Cúpula Black · Onboarding — lógica da ferramenta
   ========================================================= */
(function () {
  "use strict";

  const STORAGE_KEY = "cupula-black-membros";

  /* ---------- Conteúdo da apresentação (baseado no material 2026) ---------- */
  // Cada slide segue a identidade do deck original. As chaves {saudacao},
  // {tratamento} e {apelido} são substituídas com os dados do membro.
  const SLIDES = [
    {
      type: "welcome",
      eyebrow: "Boas-vindas",
      // preenchido dinamicamente (nome do membro)
    },
    {
      eyebrow: "Exclusividade",
      title: "Prioridade<br /><span class=\"thin\">no Acesso</span>",
      sub: "Preferência e prioridade em tudo o que a Cúpula Black oferece.",
    },
    {
      eyebrow: "O que é",
      title: "Mastermind<br /><span class=\"thin\">Puro</span>",
      sub: "Um ambiente fechado, de alto nível, onde os melhores se encontram para crescer juntos.",
    },
    {
      eyebrow: "Encontros",
      title: "3 encontros",
      tag: "2 Nacionais + 1 Internacional",
    },
    {
      eyebrow: "Retorno",
      title: "ROI",
      sub: "Um mastermind pensado para gerar retorno real sobre o seu investimento.",
    },
    {
      eyebrow: "Vivência",
      title: "Experiência",
      sub: "Muito além do conteúdo: relações, bastidores e vivências que transformam a sua trajetória.",
    },
    {
      eyebrow: "Conteúdo",
      title: "Acesso a Entregáveis<br /><span class=\"thin\">da Mentoria</span>",
      sub: "Todo o material, processos e entregáveis da mentoria à sua disposição.",
    },
    {
      eyebrow: "Oportunidade",
      title: "Rodada de<br />Investimentos",
      tag: "Precatórios",
    },
    {
      eyebrow: "Autoridade",
      title: "Palco na RED",
      sub: "Espaço no palco da RED e nas turmas do curso para membros da Black.",
    },
    {
      type: "closing",
      eyebrow: "Seja bem-vindo(a)",
    },
  ];

  /* ---------- Utilidades ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const logoHTML = (variant = "") =>
    `<span class="logo ${variant}">` +
    `<span class="logo__cupula">CÚPULA</span>` +
    `<span class="logo__black"><span class="logo__blacktext">BL<span class="gt">&gt;</span>CK</span></span>` +
    `</span>`;

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  /* ---------- Máscaras ---------- */
  function maskCPF(v) {
    v = v.replace(/\D/g, "").slice(0, 11);
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  function maskPhone(v) {
    v = v.replace(/\D/g, "").slice(0, 11);
    if (v.length <= 10) {
      return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  }

  /* ---------- Validação de CPF ---------- */
  function isValidCPF(cpf) {
    cpf = String(cpf).replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let d1 = (sum * 10) % 11;
    if (d1 === 10) d1 = 0;
    if (d1 !== parseInt(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let d2 = (sum * 10) % 11;
    if (d2 === 10) d2 = 0;
    return d2 === parseInt(cpf[10]);
  }

  /* ---------- Saudação personalizada (gênero pelo tratamento) ---------- */
  function saudacao(m) {
    if (m.tratamento === "Dra.") return "Seja bem-vinda";
    if (m.tratamento === "Dr.") return "Seja bem-vindo";
    return "Seja bem-vindo(a)";
  }
  function nomeExibicao(m) {
    const trat = m.tratamento ? m.tratamento + " " : "";
    return (trat + (m.apelido || m.nome || "")).trim();
  }

  /* ---------- Armazenamento ---------- */
  function loadMembers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveMembers(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /* =========================================================
     FORMULÁRIO
     ========================================================= */
  const form = $("#form-membro");
  const elCPF = $("#cpf");
  const elTel = $("#telefone");
  const cpfHint = $('[data-hint="cpf"]');

  elCPF.addEventListener("input", () => {
    elCPF.value = maskCPF(elCPF.value);
    const digits = elCPF.value.replace(/\D/g, "");
    if (digits.length === 11) {
      if (isValidCPF(digits)) {
        elCPF.classList.remove("is-invalid");
        cpfHint.textContent = "CPF válido ✓";
        cpfHint.className = "field__hint is-ok";
      } else {
        elCPF.classList.add("is-invalid");
        cpfHint.textContent = "CPF inválido";
        cpfHint.className = "field__hint is-error";
      }
    } else {
      elCPF.classList.remove("is-invalid");
      cpfHint.textContent = "";
      cpfHint.className = "field__hint";
    }
  });

  elTel.addEventListener("input", () => {
    elTel.value = maskPhone(elTel.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      id: editingId || String(Date.now()),
      nome: $("#nome").value.trim(),
      tratamento: $("#tratamento").value,
      apelido: $("#apelido").value.trim(),
      telefone: elTel.value.trim(),
      email: $("#email").value.trim(),
      cpf: elCPF.value.trim(),
      nascimento: $("#nascimento").value,
      endereco: $("#endereco").value.trim(),
    };

    // Todos os campos são opcionais — a apresentação abre mesmo sem dados.
    // Só persistimos um membro quando há alguma informação preenchida.
    const temDados = !!(
      data.nome || data.apelido || data.telefone || data.email ||
      data.cpf || data.nascimento || data.endereco
    );

    if (temDados) {
      const list = loadMembers();
      const idx = list.findIndex((x) => x.id === data.id);
      if (idx >= 0) list[idx] = data; else list.unshift(data);
      saveMembers(list);
      renderMembers();
    }

    editingId = null;
    openDeck(data);
  });

  form.addEventListener("reset", () => {
    editingId = null;
    elCPF.classList.remove("is-invalid");
    cpfHint.textContent = "";
    cpfHint.className = "field__hint";
  });

  /* =========================================================
     LISTA DE MEMBROS
     ========================================================= */
  let editingId = null;
  const membersList = $("#members-list");
  const membersEmpty = $("#members-empty");
  const membersCount = $("#members-count");

  function renderMembers() {
    const list = loadMembers();
    membersCount.textContent = list.length;
    membersEmpty.style.display = list.length ? "none" : "block";
    membersList.innerHTML = list
      .map((m) => {
        const meta = [m.telefone, m.email].filter(Boolean).join(" · ");
        return (
          `<li class="member" data-id="${m.id}">` +
          `<div class="member__info">` +
          `<div class="member__name">${escapeHTML(nomeExibicao(m))}</div>` +
          `<div class="member__meta">${escapeHTML(meta || m.nome)}</div>` +
          `</div>` +
          `<div class="member__actions">` +
          `<button class="iconbtn iconbtn--play" data-act="play" title="Abrir apresentação">▶</button>` +
          `<button class="iconbtn" data-act="edit" title="Editar">✎</button>` +
          `<button class="iconbtn" data-act="del" title="Remover">🗑</button>` +
          `</div>` +
          `</li>`
        );
      })
      .join("");
  }

  membersList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const id = e.target.closest(".member").dataset.id;
    const list = loadMembers();
    const m = list.find((x) => x.id === id);
    if (!m) return;

    if (btn.dataset.act === "play") openDeck(m);
    if (btn.dataset.act === "edit") fillForm(m);
    if (btn.dataset.act === "del") {
      if (confirm(`Remover ${nomeExibicao(m)}?`)) {
        saveMembers(list.filter((x) => x.id !== id));
        renderMembers();
      }
    }
  });

  function fillForm(m) {
    editingId = m.id;
    $("#nome").value = m.nome || "";
    $("#tratamento").value = m.tratamento || "";
    $("#apelido").value = m.apelido || "";
    elTel.value = m.telefone || "";
    $("#email").value = m.email || "";
    elCPF.value = m.cpf || "";
    $("#nascimento").value = m.nascimento || "";
    $("#endereco").value = m.endereco || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#nome").focus();
  }

  /* =========================================================
     APRESENTAÇÃO (DECK)
     ========================================================= */
  const viewCentral = $("#view-central");
  const viewDeck = $("#view-deck");
  const deckEl = $("#deck");
  const dotsEl = $("#deck-dots");
  const progressBar = $("#deck-progress-bar");
  let current = 0;
  let total = 0;

  // Lockup do nome: tratamento discreto + primeiro nome em destaque
  function nameLockup(m) {
    const pre = m.tratamento
      ? `<span class="welcome__pre">${escapeHTML(m.tratamento)}</span>`
      : "";
    const first = escapeHTML(m.apelido || m.nome || "");
    return `<h1 class="welcome__name">${pre}<span class="welcome__first">${first}</span></h1>`;
  }

  function buildSlide(slide, index, member) {
    const num = String(index).padStart(2, "0");
    let inner = "";

    const temNome = !!(member && (member.apelido || member.nome));

    if (slide.type === "welcome") {
      inner = temNome
        ? `<div class="slide__inner slide__inner--welcome">` +
          `<div class="welcome__logo">${logoHTML("logo--md")}</div>` +
          `<p class="welcome__eyebrow">${saudacao(member)},</p>` +
          nameLockup(member) +
          `<div class="welcome__rule"></div>` +
          `<p class="welcome__lead">Boas-vindas à <strong>Cúpula Black</strong> — o Mastermind Puro.</p>` +
          `<div class="slide__signature">Sua jornada começa aqui · 2026</div>` +
          `</div>`
        : `<div class="slide__inner slide__inner--welcome">` +
          `<p class="welcome__eyebrow">Boas-vindas à</p>` +
          `<div class="welcome__logo welcome__logo--hero">${logoHTML("logo--lg")}</div>` +
          `<div class="welcome__rule"></div>` +
          `<p class="welcome__lead">O <strong>Mastermind Puro</strong>. Sua jornada começa aqui.</p>` +
          `<div class="slide__signature">Cúpula Black · 2026</div>` +
          `</div>`;
      return slideWrap("cover", num, inner);
    }

    if (slide.type === "closing") {
      inner = temNome
        ? `<div class="slide__inner slide__inner--welcome">` +
          `<p class="welcome__eyebrow">${saudacao(member)},</p>` +
          nameLockup(member) +
          `<div class="welcome__rule"></div>` +
          `<div class="welcome__logo welcome__logo--btm">${logoHTML("logo--md")}</div>` +
          `<div class="slide__signature">Nos vemos no topo · 2026</div>` +
          `</div>`
        : `<div class="slide__inner slide__inner--welcome">` +
          `<div class="welcome__logo welcome__logo--hero">${logoHTML("logo--lg")}</div>` +
          `<div class="welcome__rule"></div>` +
          `<div class="slide__signature">Nos vemos no topo · 2026</div>` +
          `</div>`;
      return slideWrap("cover", num, inner);
    }

    inner =
      `<div class="slide__inner">` +
      `<p class="slide__eyebrow">${slide.eyebrow}</p>` +
      `<h2 class="slide__title">${slide.title}</h2>` +
      (slide.sub ? `<p class="slide__sub">${slide.sub}</p>` : "") +
      (slide.tag ? `<span class="slide__tag">${slide.tag}</span>` : "") +
      `</div>`;
    return slideWrap("", num, inner);
  }

  function slideWrap(modifier, num, inner) {
    const el = document.createElement("section");
    el.className = "slide" + (modifier ? " slide--" + modifier : "");
    el.innerHTML =
      `<div class="slide__scrim"></div>` +
      `<div class="slide__num">${num}</div>` +
      inner;
    return el;
  }

  function openDeck(member) {
    deckEl.innerHTML = "";
    dotsEl.innerHTML = "";
    total = SLIDES.length;

    SLIDES.forEach((s, i) => {
      deckEl.appendChild(buildSlide(s, i, member));
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", "Ir para o slide " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(dot);
    });

    current = 0;
    viewCentral.classList.remove("is-active");
    viewDeck.classList.add("is-active");
    goTo(0);
  }

  function closeDeck() {
    viewDeck.classList.remove("is-active");
    viewCentral.classList.add("is-active");
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  function goTo(i) {
    if (i < 0 || i >= total) return;
    current = i;
    $$(".slide", deckEl).forEach((s, idx) => s.classList.toggle("is-active", idx === i));
    $$(".dot", dotsEl).forEach((d, idx) => d.classList.toggle("is-active", idx === i));
    progressBar.style.width = ((i + 1) / total) * 100 + "%";
  }
  const next = () => goTo(Math.min(current + 1, total - 1));
  const prev = () => goTo(Math.max(current - 1, 0));

  $("#deck-next").addEventListener("click", next);
  $("#deck-prev").addEventListener("click", prev);
  $("#deck-exit").addEventListener("click", closeDeck);
  $("#deck-full").addEventListener("click", () => {
    if (!document.fullscreenElement) viewDeck.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  });

  document.addEventListener("keydown", (e) => {
    if (!viewDeck.classList.contains("is-active")) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
    else if (e.key === "Escape") closeDeck();
    else if (e.key === "f" || e.key === "F") $("#deck-full").click();
  });

  // navegação por toque
  let touchX = null;
  deckEl.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  deckEl.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX = null;
  });

  /* ---------- init ---------- */
  $$("[data-logo]").forEach((el) => (el.innerHTML = logoHTML("logo--sm")));
  renderMembers();
})();
