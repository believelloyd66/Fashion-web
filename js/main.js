const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
});

// Set the minimum booking date to today in the visitor's local timezone.
const dateInput = document.querySelector("#date-input");
if (dateInput) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localDate;
}

document.querySelector("#year").textContent = new Date().getFullYear();

// Service cards preselect the matching service in the quote form.
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const serviceSelect = document.querySelector("#service-select");
    if (serviceSelect) serviceSelect.value = link.dataset.service;
  });
});

// Demo-only: prepare a message for the visitor to copy. This does not send data
// or create a real booking; connect a trusted backend/form service before launch.
const bookingForm = document.querySelector("#booking-form");
const formResult = document.querySelector("#form-result");

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const values = new FormData(bookingForm);
  const request = [
    "FreshNest Cleaning — booking request",
    `Name: ${values.get("name")}`,
    `Email: ${values.get("email")}`,
    `Phone: ${values.get("phone")}`,
    `Service: ${values.get("service")}`,
    `Property size: ${values.get("size")}`,
    `Preferred date: ${values.get("date")}`,
    `Location: ${values.get("location")}`,
    `Additional notes: ${values.get("notes") || "None"}`
  ].join("\\n");

  formResult.hidden = false;
  formResult.textContent = "Demo only — your details have not been sent or saved. Here is the request text you can copy:\\n\\n" + request;

  let copyButton = document.querySelector("#copy-request");
  if (!copyButton) {
    copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.id = "copy-request";
    copyButton.className = "button button-dark";
    copyButton.style.marginTop = "12px";
    copyButton.textContent = "Copy request text";
    formResult.insertAdjacentElement("afterend", copyButton);
  }
  copyButton.onclick = async () => {
    try {
      await navigator.clipboard.writeText(request);
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Copy unavailable — select the text above";
    }
  };
});
