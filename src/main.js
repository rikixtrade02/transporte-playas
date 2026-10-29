import { SITE_CONFIG as C } from "./config.js";

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, text) => { 
  const n = document.createElement(tag); 
  if (cls) n.className = cls; 
  if (text) n.textContent = text; 
  return n; 
};
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

// ---------- WhatsApp ----------
const waValid = /^593\d{9}$/.test(C.whatsappNumber);
const waLink = (msg) => `https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(msg)}`;
const msgGeneral = "¡Hola! Vi la web y quiero consultar disponibilidad para un viaje a la playa desde Guayaquil. ¿Podrían ayudarme con la disponibilidad para mi fecha?";
const msgDest = (d, n) => `¡Hola! Vi la web y quiero consultar disponibilidad para un viaje a ${d.name} (${money(d.price)} por grupo, ida y vuelta) para ${n} personas. Quisiera consultar disponibilidad para una fecha.`;
const msgCustom = (dest, n) => `¡Hola! Vi la web y quisiera cotizar transporte privado de ida y vuelta desde Guayaquil hacia ${dest}. Somos ${n} personas. ¿Me pueden ayudar con la tarifa?`;

function setWa(a, msg) {
  if (!a) return;
  if (!waValid) {
    a.href = "#config-warning";
    a.setAttribute("aria-disabled", "true");
    a.classList.add("off");
    a.addEventListener("click", (e) => e.preventDefault());
    return;
  }
  a.href = waLink(msg);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
}

// ---------- Datos globales ----------
document.querySelectorAll("[data-brand]").forEach((n) => (n.textContent = C.businessName));
const brandText = $("[data-brand-text]");
if (brandText) brandText.textContent = C.businessName;

const depEl = $("[data-dep]");
if (depEl) depEl.textContent = C.defaultDepartureTime;

const retEl = $("[data-ret]");
if (retEl) retEl.textContent = C.defaultReturnTime;

const origEl = $("[data-origin]");
if (origEl) origEl.textContent = C.origin;

if (!waValid) {
  const warnEl = $("#config-warning");
  if (warnEl) warnEl.hidden = false;
}
document.querySelectorAll('[data-wa="general"]').forEach((a) => setWa(a, msgGeneral));

// ---------- Destinos y Stepper ----------
let pax = C.maxPassengers;
const paxCount = $("#pax-count");
const btnDec = $("#pax-dec");
const btnInc = $("#pax-inc");

const perPersonText = (d) =>
  pax === C.maxPassengers
    ? `Desde ${money(d.price / C.maxPassengers)} por persona si viajan ${C.maxPassengers}`
    : `Referencia: ${money(d.price / pax)} por persona si viajan ${pax}`;

const cards = [];

function buildCard(d) {
  const li = el("article", "card");
  const ph = el("div", "ph");
  const img = new Image();
  img.src = d.image;
  img.alt = `Playa de ${d.name}`;
  img.width = 640;
  img.height = 480;
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("error", () => img.remove());
  ph.append(el("span", "ph-name", d.name), img);

  const body = el("div", "card-body");
  const price = el("p", "price");

  const priceRow = el("div", "price-row");
  priceRow.append(el("strong", "", money(d.price)));
  if (d.originalPrice && d.originalPrice > d.price) {
    priceRow.append(el("s", "old-price", money(d.originalPrice)));
    const desc = Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100);
    priceRow.append(el("span", "badge-discount", `-${desc}%`));
  }

  price.append(priceRow, el("span", "tag-trip", "Por grupo · ida y vuelta"));

  const per = el("p", "per", perPersonText(d));
  const a = el("a", "btn wa", "Consultar este destino");
  setWa(a, msgDest(d, pax));

  body.append(el("h3", "", d.name), el("p", "", d.description), price, per, a);
  li.append(ph, body);
  cards.push({ d, per, a });
  return li;
}

const cardsContainer = $("#cards");
if (cardsContainer && C.destinations) {
  cardsContainer.append(...C.destinations.map(buildCard));
}

function refreshCards() {
  cards.forEach(({ d, per, a }) => {
    if (per) per.textContent = perPersonText(d);
    if (a) setWa(a, msgDest(d, pax));
  });
}

function updatePaxDisplay() {
  if (paxCount) paxCount.textContent = pax;
  if (btnDec) btnDec.disabled = pax <= 1;
  if (btnInc) btnInc.disabled = pax >= C.maxPassengers;
  refreshCards();
}

if (btnDec && btnInc) {
  btnDec.addEventListener("click", () => {
    if (pax > 1) {
      pax--;
      updatePaxDisplay();
    }
  });

  btnInc.addEventListener("click", () => {
    if (pax < C.maxPassengers) {
      pax++;
      updatePaxDisplay();
    }
  });
  updatePaxDisplay();
}

// ---------- Cotización otro destino ----------
const quoteForm = $("#quote");
if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dest = $("#q-dest").value.trim().replace(/\s+/g, " ");
    const n = Number($("#q-pax").value);
    const err = $("#q-err");
    if (dest.length < 3) {
      err.textContent = "Escribe el nombre de la playa o balneario.";
      $("#q-dest").focus();
      return;
    }
    if (!Number.isInteger(n) || n < 1 || n > C.maxPassengers) {
      err.textContent = `Indica entre 1 y ${C.maxPassengers} personas.`;
      $("#q-pax").focus();
      return;
    }
    if (!waValid) {
      err.textContent = "El contacto de WhatsApp aún no está configurado.";
      return;
    }
    err.textContent = "";
    window.open(waLink(msgCustom(dest, n)), "_blank", "noopener,noreferrer");
  });
}

// ---------- Carrusel ----------
const track = $("#track");
const dots = $("#dots");

if (track && dots && Array.isArray(C.carousel)) {
  C.carousel.forEach((s, i) => {
    const f = el("figure", "slide");
    f.setAttribute("aria-label", `${i + 1} de ${C.carousel.length}`);
    
    const ph = el("div", "ph slide-ph");
    ph.append(el("span", "ph-name", s.label || "Furgoneta"));
    
    const img = new Image();
    img.src = s.image;
    img.alt = s.label;
    img.width = 960;
    img.height = 640;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => img.remove());
    ph.append(img);
    
    f.append(ph, el("figcaption", "", s.label));
    track.append(f);

    const b = el("button", "dot");
    b.type = "button";
    b.setAttribute("aria-label", `Ir a la foto ${i + 1}`);
    b.addEventListener("click", () => go(i));
    dots.append(b);
  });

  const slides = [...track.children];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  const idx = () => {
    if (!slides.length || !slides[0].offsetWidth) return 0;
    return Math.round(track.scrollLeft / slides[0].offsetWidth);
  };

  function go(i) {
    if (!slides.length) return;
    const n = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[n].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }

  function mark() {
    const c = idx();
    [...dots.children].forEach((d, i) => d.setAttribute("aria-current", String(i === c)));
  }

  track.addEventListener("scroll", () => requestAnimationFrame(mark), { passive: true });
  
  const prevBtn = $("#prev");
  const nextBtn = $("#next");
  if (prevBtn) prevBtn.addEventListener("click", () => go(idx() - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => go(idx() + 1));
  
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(idx() + 1);
    if (e.key === "ArrowLeft") go(idx() - 1);
  });

  mark();
}

// ---------- FAQ ----------
const faqList = $("#faq-list");
if (faqList) {
  const faq = [
    ["¿Cuántas personas pueden viajar?", `Hasta ${C.maxPassengers} pasajeros con comodidad, además del conductor profesional.`],
    ["¿El precio es por persona o por grupo?", "Es por grupo. El valor por persona es solo una referencia: se divide el total entre quienes viajan."],
    ["¿El precio incluye ida y vuelta?", `Sí. Cada tarifa corresponde al viaje redondo. Salida habitual ${C.defaultDepartureTime} y retorno habitual ${C.defaultReturnTime}.`],
    ["¿Desde dónde sale la furgoneta?", `Las salidas son desde ${C.origin}.`],
    ["¿Pueden recogernos en una dirección acordada?", "Sí. La recogida es en un único domicilio acordado o en un punto de encuentro que coordinen con el grupo."],
    ["¿Podemos llevar hieleras, bolsos o carpas?", "La unidad tiene una parrilla superior amplia para equipaje. Para cargas grandes, confirma por WhatsApp."],
    ["¿Podemos coordinar otro horario?", "Sí, previa coordinación. Escríbenos con la hora que necesitan."],
    ["¿Qué ocurre si queremos viajar a otra playa?", "Usa el formulario «Cotiza tu destino» y te responderemos con tarifa y disponibilidad."],
    ["¿Cómo confirmamos la disponibilidad?", "Por WhatsApp. Enviar un mensaje no confirma la reserva: fecha, disponibilidad y recogida se acuerdan con el servicio."],
  ];

  faqList.append(...faq.map(([q, a]) => {
    const d = el("details");
    d.append(el("summary", "", q), el("p", "", a));
    return d;
  }));
}