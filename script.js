// Naama Melzer portfolio interactions
(() => {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function initSlider(track, prev, next, dots, interval = 0) {
    if (!track) return;
    const total = track.querySelectorAll("img").length;
    if (!total) return;
    let index = 0, timer = null;
    const wrapper = track.parentElement;
    function goTo(value) {
      index = (value + total) % total;
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dots) dots.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
        dot.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const start = () => { if (interval && !reducedMotion && !document.hidden && !timer) timer = setInterval(() => goTo(index + 1), interval); };
    const reset = () => { stop(); start(); };
    if (dots) Array.from({length:total}, (_, i) => {
      const dot = document.createElement("button"); dot.type = "button";
      dot.setAttribute("aria-label", `Show image ${i + 1} of ${total}`);
      dot.addEventListener("click", () => { goTo(i); reset(); }); dots.appendChild(dot);
    });
    if (prev) prev.addEventListener("click", () => { goTo(index - 1); reset(); });
    if (next) next.addEventListener("click", () => { goTo(index + 1); reset(); });
    if (wrapper) {
      let x = null;
      wrapper.addEventListener("touchstart", e => { x = e.changedTouches[0].clientX; }, {passive:true});
      wrapper.addEventListener("touchend", e => { if (x === null) return; const dx = e.changedTouches[0].clientX-x; if(dx < -45)goTo(index+1); if(dx > 45)goTo(index-1); x=null; reset(); }, {passive:true});
      wrapper.addEventListener("mouseenter", stop); wrapper.addEventListener("mouseleave", start);
      wrapper.addEventListener("focusin", stop); wrapper.addEventListener("focusout", start);
    }
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
    goTo(0); start();
  }
  function initShowreel() {
    const button = document.getElementById("showreel-play"); if (!button) return;
    button.addEventListener("click", () => {
      const id = button.dataset.videoId; if (!id) return;
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
      frame.title = "Naama Melzer video editing showreel"; frame.loading = "eager";
      frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin"; frame.allowFullscreen = true;
      button.replaceWith(frame); frame.parentElement.classList.add("showreel-playing");
    });
  }
  function initContactForm() {
    const form = document.getElementById("contact-form"); if (!form) return;
    const button = document.getElementById("submit-btn"), status = document.getElementById("form-status");
    const endpoint = "https://formsubmit.co/ajax/naamamelzer@gmail.com"; if (!button || !status) return;
    const original = button.innerHTML;
    form.addEventListener("submit", async event => {
      event.preventDefault(); if (!form.reportValidity()) return;
      button.disabled = true; button.setAttribute("aria-disabled","true"); form.setAttribute("aria-busy","true");
      button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
      status.textContent = "Sending your message…"; status.className = "form-status";
      try {
        const params = new URLSearchParams();
        for (const [key,value] of new FormData(form).entries()) params.append(key,value);
        const response = await fetch(endpoint,{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:params.toString()});
        const result = await response.json();
        if(!response.ok || !(result.success === true || result.success === "true")) throw new Error(result.message || "Message not accepted");
        status.textContent = "Thank you — your message has been sent. Naama will get back to you soon.";
        status.classList.add("is-success"); form.reset();
      } catch(error) {
        console.error("Contact form submission failed:",error);
        status.textContent = "Sorry, the message could not be sent right now. Please email naamamelzer@gmail.com or contact Naama on WhatsApp.";
        status.classList.add("is-error");
      } finally {
        button.disabled = false; button.removeAttribute("aria-disabled"); form.removeAttribute("aria-busy"); button.innerHTML = original;
      }
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    initSlider(document.getElementById("home-track"),document.getElementById("home-prev"),document.getElementById("home-next"),document.getElementById("home-dots"),4500);
    document.querySelectorAll(".vp-track").forEach(track => {
      const parent = track.closest(".slider-wrap") || track.parentElement;
      initSlider(track,parent?.querySelector(".vp-prev"),parent?.querySelector(".vp-next"),null,0);
    });
    initShowreel(); initContactForm();
    document.querySelectorAll(".current-year").forEach(el => el.textContent=String(new Date().getFullYear()));
  });
})();