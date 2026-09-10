const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const hotspots = document.querySelectorAll(".hotspot");
const closeTargets = document.querySelectorAll("[data-close-modal]");
const viewButtons = document.querySelectorAll("[data-view-target]");
const views = document.querySelectorAll("[data-view]");
const navButtons = document.querySelectorAll(".nav-button[data-nav]");

let lastFocusedElement = null;

function openModal(imageSrc, title) {
  lastFocusedElement = document.activeElement;
  modalImage.src = imageSrc;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => modal.querySelector(".modal-close").focus());
}

function closeModal() {
  if (!modal.classList.contains("is-open")) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  window.setTimeout(() => {
    if (!modal.classList.contains("is-open")) {
      modalImage.src = "";
      modalImage.alt = "";
    }
  }, 180);

  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function sectionForView(viewName) {
  if (viewName === "home") return "home";
  if (["diagnostics-menu", "urti", "asthma", "pft-diagnosis"].includes(viewName)) return "diagnostics";
  if (["treatments-menu", "asthma-treatment", "copd-treatment", "copd-acute-exacerbation-treatment"].includes(viewName)) return "treatments";
  return "home";
}

function titleForView(viewName) {
  const titles = {
    home: "Respiratory Flowcharts",
    "diagnostics-menu": "Diagnostic Flowcharts — Respiratory Flowcharts",
    "treatments-menu": "Treatment Approaches — Respiratory Flowcharts",
    urti: "URTI Diagnosis — Respiratory Flowcharts",
    asthma: "Asthma Diagnosis — Respiratory Flowcharts",
    "pft-diagnosis": "PFT Diagnosis — Respiratory Flowcharts",
    "asthma-treatment": "Asthma Treatment — Respiratory Flowcharts",
    "copd-treatment": "COPD Treatment — Respiratory Flowcharts",
    "copd-acute-exacerbation-treatment": "Acute COPD Exacerbation Treatment — Respiratory Flowcharts"
  };
  return titles[viewName] || "Respiratory Flowcharts";
}

function showView(viewName) {
  closeModal();

  views.forEach((view) => {
    const active = view.dataset.view === viewName;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });

  const activeSection = sectionForView(viewName);
  navButtons.forEach((button) => {
    const active = button.dataset.nav === activeSection;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.title = titleForView(viewName);

  // Gives browser back/forward useful state without creating separate pages.
  if (history.replaceState) {
    history.replaceState({ view: viewName }, "", `#${viewName}`);
  }
}

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    openModal(hotspot.dataset.modalImage, hotspot.dataset.modalTitle);
  });
});

closeTargets.forEach((target) => target.addEventListener("click", closeModal));
viewButtons.forEach((button) => button.addEventListener("click", () => showView(button.dataset.viewTarget)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

// Open a bookmarked section if one is present; otherwise show Home.
const initialHash = window.location.hash.replace("#", "");
const validViews = new Set([...views].map((view) => view.dataset.view));
showView(validViews.has(initialHash) ? initialHash : "home");
