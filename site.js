const toggle = document.querySelector("[data-nav-toggle]");
const links = document.querySelector("[data-nav-links]");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const message = String(data.get("message") || "").trim();

    const local = ["m", "m", "b", "o", "t", "g", "r", "o", "u", "p"].join("");
    const domain = ["g", "m", "a", "i", "l", ".", "c", "o", "m"].join("");
    const recipient = `${local}@${domain}`;
    const subject = "AlphaWeave Capital platform walkthrough";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      organization ? `Organization: ${organization}` : "Organization:",
      "",
      message
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll("[data-click-card]").forEach((card) => {
  card.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-card-detail]").forEach((detailTarget) => {
  const scope = detailTarget.closest(".container") || detailTarget.closest(".section") || document;
  const cards = Array.from(scope.querySelectorAll("[data-click-card]"));
  const initialText = detailTarget.textContent.trim();

  if (!cards.length) return;

  const setDetail = (card) => {
    const isOpen = card.classList.contains("is-active");

    cards.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-expanded", "false");
      item.querySelectorAll(".inline-detail").forEach((detail) => detail.remove());
    });

    if (isOpen) {
      detailTarget.textContent = initialText;
      return;
    }

    const detail = card.dataset.detail || "";
    const title = card.dataset.title || card.querySelector("h3, strong")?.textContent?.trim() || "Detail";
    const inlineDetail = document.createElement("div");
    inlineDetail.className = "inline-detail";
    const inlineCopy = document.createElement("span");
    inlineCopy.textContent = detail || card.textContent.trim();
    inlineDetail.append(inlineCopy);

    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    card.appendChild(inlineDetail);
    detailTarget.textContent = `${title}: ${detail || card.textContent.trim()}`;
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => setDetail(card));
  });
});
