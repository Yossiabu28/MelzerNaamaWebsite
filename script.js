// Naama Melzer portfolio interactions
(() => {
  "use strict";

  function initProjectFilters() {
    const buttons = document.querySelectorAll("[data-filter]");
    const projects = document.querySelectorAll(".project-card[data-category], .project-entry[data-category]");
    if (!buttons.length || !projects.length) return;

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach(item => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        projects.forEach(project => {
          const matches = filter === "all" || project.dataset.category === filter;
          project.hidden = !matches;
        });
      });
    });
  }


  function initInlineProjectCards() {
    const cards = document.querySelectorAll(".project-card");
    if (!cards.length) return;

    cards.forEach(card => {
      const frame = card.querySelector("iframe[data-src]");
      card.addEventListener("toggle", () => {
        if (card.open) {
          cards.forEach(other => {
            if (other !== card && other.open) other.open = false;
          });
          if (frame && !frame.hasAttribute("src")) {
            frame.setAttribute("src", frame.dataset.src);
          }
        } else if (frame) {
          // Stop playback when a project is collapsed; it will load again when reopened.
          frame.removeAttribute("src");
        }
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const button = document.getElementById("submit-btn");
    const status = document.getElementById("form-status");
    const endpoint = "https://formsubmit.co/ajax/naamamelzer@gmail.com";
    if (!button || !status) return;

    const originalButtonMarkup = button.innerHTML;
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
      form.setAttribute("aria-busy", "true");
      button.textContent = "SENDING…";
      status.textContent = "Sending your message…";
      status.className = "form-status";

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok || !(result.success === true || result.success === "true")) {
          throw new Error(result.message || "The message was not accepted.");
        }

        status.textContent = "Thank you — your message has been sent. Naama will get back to you soon.";
        status.classList.add("is-success");
        form.reset();
      } catch (error) {
        console.error("Contact form submission failed:", error);
        status.textContent = "Sorry, the message could not be sent right now. Please email naamamelzer@gmail.com or contact Naama on WhatsApp.";
        status.classList.add("is-error");
      } finally {
        button.disabled = false;
        button.removeAttribute("aria-disabled");
        form.removeAttribute("aria-busy");
        button.innerHTML = originalButtonMarkup;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initProjectFilters();
    initContactForm();
    document.querySelectorAll(".current-year").forEach(element => {
      element.textContent = String(new Date().getFullYear());
    });
  });
})();