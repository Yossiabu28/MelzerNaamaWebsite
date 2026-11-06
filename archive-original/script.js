// ============================================================
//  NAAMA MELZER PORTFOLIO  —  Unified Script
// ============================================================

// ── Generic Slider factory ────────────────────────────────
function initSlider(trackEl, prevBtn, nextBtn, dotsEl, autoPlay) {
  if (!trackEl) return;

  const imgs = trackEl.querySelectorAll('img');
  const total = imgs.length;
  if (total === 0) return;

  let idx = 0;
  let timer;

  // Build dots
  if (dotsEl) {
    imgs.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });
  }

  function goTo(n) {
    idx = (n + total) % total;
    trackEl.style.transform = `translateX(-${idx * 100}%)`;
    if (dotsEl) {
      dotsEl.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }

  function next() { goTo(idx + 1); }
  function prev() { goTo(idx - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  // Touch swipe
  let sx = 0;
  trackEl.parentElement.addEventListener('touchstart', e => { sx = e.touches[0].clientX; });
  trackEl.parentElement.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (dx < -40) { next(); resetAuto(); }
    else if (dx > 40) { prev(); resetAuto(); }
  });

  function startAuto() {
    if (autoPlay) timer = setInterval(next, autoPlay);
  }
  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  startAuto();
  goTo(0);
}

// ── Init all sliders on page load ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Home page hero slider
  initSlider(
    document.getElementById('home-track'),
    document.getElementById('home-prev'),
    document.getElementById('home-next'),
    document.getElementById('home-dots'),
    3500
  );

  // Video page: multiple paired sliders
  const vpTracks = document.querySelectorAll('.vp-track');
  vpTracks.forEach(track => {
    const wrap = track.closest('.slider-wrap') || track.parentElement;
    const prev = wrap.querySelector('.vp-prev');
    const next = wrap.querySelector('.vp-next');
    initSlider(track, prev, next, null, 0);
  });

  // ── Video Player Controls ────────────────────────────────
  const video = document.getElementById('hero-video');
  const playBtn = document.getElementById('vc-play');
  const restartBtn = document.getElementById('vc-restart');
  const muteBtn = document.getElementById('vc-mute');
  const bar = document.getElementById('vc-bar');

  if (video) {
    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        bar.style.width = (video.currentTime / video.duration * 100) + '%';
      }
    });

    const progress = document.querySelector('.vc-progress');
    if (progress) {
      progress.addEventListener('click', e => {
        const rect = progress.getBoundingClientRect();
        video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration;
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          playBtn.title = 'Pause';
        } else {
          video.pause();
          playBtn.innerHTML = '<i class="fas fa-play"></i>';
          playBtn.title = 'Play';
        }
      });
      video.addEventListener('ended', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.title = 'Play';
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        video.currentTime = 0;
        video.play();
        if (playBtn) {
          playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          playBtn.title = 'Pause';
        }
      });
    }

    if (muteBtn) {
      muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      muteBtn.title = 'Unmute';
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted
          ? '<i class="fas fa-volume-mute"></i>'
          : '<i class="fas fa-volume-up"></i>';
        muteBtn.title = video.muted ? 'Unmute' : 'Mute';
      });
    }
  }

  // ── EmailJS contact form ─────────────────────────────────
  if (typeof emailjs !== 'undefined') {
    emailjs.init('jBBFjz6cGH9b0ft6b');
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = document.getElementById('submit-btn');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      btn.disabled = true;

      // Send notification to Naama
      emailjs.sendForm('service_t9mw0br', 'template_e2ah3bg', this)
        .then(() => {
          // Send auto-reply to the person who contacted (if template 2 exists)
          const autoReplyTemplateId = 'TEMPLATE_ID_2'; // replace when ready
          if (autoReplyTemplateId !== 'TEMPLATE_ID_2') {
            emailjs.sendForm('service_t9mw0br', autoReplyTemplateId, form);
          }
          showModal('✨ Thank you! Your message was sent successfully.');
          form.reset();
        })
        .catch(() => {
          showModal('Something went wrong — please try again or email me directly.');
        })
        .finally(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.disabled = false;
        });
    });
  }

  // Modal helpers
  const modal = document.getElementById('statusModal');
  const closeBtn = document.getElementById('closeStatusModal');

  function showModal(msg) {
    if (!modal) return;
    document.getElementById('statusMessage').textContent = msg;
    modal.classList.add('open');
    setTimeout(() => modal.classList.remove('open'), 4000);
  }

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
});
