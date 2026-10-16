(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const musicButton = $("#musicButton");
  const backgroundMusic = $("#backgroundMusic");
  const giftButton = $("#giftButton");
  const intro = $("#intro");
  const mainContent = $("#mainContent");
  const envelope = $("#envelope");
  const envelopeHint = $("#envelopeHint");
  const surpriseButton = $("#surpriseButton");
  const surpriseMessage = $("#surpriseMessage");
  const sparkleLayer = $("#sparkleLayer");
  const musicToast = $("#musicToast");

  let musicPlaying = false;
  let introOpened = false;
  let toastTimer = null;
  let sparkleTimer = null;
  let activeImageIndex = 0;
  let lastFocusedElement = null;

  const galleryButtons = $$(".memory-image");

  const gallery = galleryButtons.map((button) => ({
    src: button.dataset.lightbox,
    caption:
      button.dataset.caption ||
      button.querySelector("img")?.alt ||
      "Our memory",
    alt: button.querySelector("img")?.alt || "ความทรงจำของเรา"
  }));

  /* =========================================
     TOAST MESSAGE
  ========================================= */

  function showToast(message) {
    if (!musicToast) return;

    musicToast.textContent = message;
    musicToast.classList.add("is-visible");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      musicToast.classList.remove("is-visible");
    }, 2600);
  }

  /* =========================================
     MUSIC CONTROL
  ========================================= */

  function updateMusicButton() {
    if (!musicButton) return;

    musicButton.classList.toggle("is-playing", musicPlaying);

    musicButton.innerHTML = `
      <span class="music-icon" aria-hidden="true">
        ${musicPlaying ? "♫" : "♪"}
      </span>
      <span class="music-label">
        ${musicPlaying ? "Playing" : "Music"}
      </span>
    `;

    musicButton.setAttribute(
      "aria-label",
      musicPlaying ? "ปิดเพลงพื้นหลัง" : "เปิดเพลงพื้นหลัง"
    );

    musicButton.title = musicPlaying
      ? "ปิดเพลงพื้นหลัง"
      : "เปิดเพลงพื้นหลัง";
  }

  async function playMusic() {
    if (!backgroundMusic) return;

    try {
      await backgroundMusic.play();

      musicPlaying = true;
      updateMusicButton();

      showToast("กำลังเล่นเพลงสำหรับช่วงเวลาพิเศษนี้ ♡");
    } catch (error) {
      musicPlaying = false;
      updateMusicButton();

      showToast(
        "เปิดเพลงไม่สำเร็จ ตรวจสอบว่าไฟล์เพลงอยู่ในโฟลเดอร์เดียวกับ index.html"
      );

      console.warn("ไม่สามารถเปิดเพลง:", error);
    }
  }

  function pauseMusic() {
    if (!backgroundMusic) return;

    backgroundMusic.pause();
    musicPlaying = false;
    updateMusicButton();
  }

  if (musicButton) {
    musicButton.addEventListener("click", () => {
      if (musicPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  if (backgroundMusic) {
    backgroundMusic.addEventListener("play", () => {
      musicPlaying = true;
      updateMusicButton();
    });

    backgroundMusic.addEventListener("pause", () => {
      musicPlaying = false;
      updateMusicButton();
    });

    backgroundMusic.addEventListener("ended", () => {
      musicPlaying = false;
      updateMusicButton();
    });
  }

  /* =========================================
     HEART EFFECTS
  ========================================= */

  function createParticle(className, symbols, options = {}) {
    const particle = document.createElement("span");

    particle.className = className;
    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = `${Math.random() * 100}%`;

    particle.style.setProperty(
      "--duration",
      `${options.minDuration || 4 + Math.random() * 4}s`
    );

    particle.style.setProperty(
      "--drift",
      `${Math.round(Math.random() * 80 - 40)}px`
    );

    particle.style.fontSize =
      `${options.minSize || 12 + Math.random() * 15}px`;

    particle.style.top = options.top ?? "auto";
    particle.style.bottom = options.bottom ?? "-30px";

    document.body.appendChild(particle);

    window.setTimeout(() => {
      particle.remove();
    }, options.life || 8500);
  }

  function createHeartBurst(count = 18) {
    const symbols = ["♡", "♥", "✧", "✦", "❀"];

    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => {
        createParticle("heart-particle", symbols, {
          minDuration: 3 + Math.random() * 3,
          minSize: 13 + Math.random() * 20,
          bottom: "-25px",
          life: 7000
        });
      }, i * 75);
    }
  }

  /* =========================================
     CONFETTI EFFECT
  ========================================= */

  function createConfetti(count = 54) {
    const symbols = ["✦", "✧", "♡", "♥", "❀"];

    for (let i = 0; i < count; i += 1) {
      const confetti = document.createElement("span");

      confetti.className = "confetti-particle";

      confetti.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      confetti.style.left = `${Math.random() * 100}%`;

      confetti.style.setProperty(
        "--fall-duration",
        `${2.3 + Math.random() * 2.7}s`
      );

      confetti.style.setProperty(
        "--fall-delay",
        `${Math.random() * 0.8}s`
      );

      confetti.style.fontSize =
        `${10 + Math.random() * 18}px`;

      document.body.appendChild(confetti);

      window.setTimeout(() => {
        confetti.remove();
      }, 6000);
    }
  }

  /* =========================================
     GOLD SPARKLE EFFECT
  ========================================= */

  function createSparkle() {
    if (!sparkleLayer || document.hidden) return;

    const particle = document.createElement("span");

    particle.className = "sparkle-particle";
    particle.textContent = Math.random() > 0.45 ? "✦" : "✧";

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${18 + Math.random() * 72}%`;

    particle.style.setProperty(
      "--duration",
      `${3.5 + Math.random() * 3}s`
    );

    particle.style.setProperty(
      "--drift",
      `${Math.round(Math.random() * 60 - 30)}px`
    );

    particle.style.fontSize =
      `${8 + Math.random() * 11}px`;

    sparkleLayer.appendChild(particle);

    window.setTimeout(() => {
      particle.remove();
    }, 7000);
  }

  function startSparkles() {
    if (sparkleTimer) return;

    sparkleTimer = window.setInterval(createSparkle, 900);
  }

  /* =========================================
     OPEN BIRTHDAY SURPRISE
  ========================================= */

  function openSurprise() {
    if (introOpened || !intro || !mainContent) return;

    introOpened = true;

    if (giftButton) {
      giftButton.disabled = true;
    }

    // เริ่มเพลงหลังจากผู้ใช้กดปุ่ม
    playMusic();

    // เอฟเฟกต์หัวใจและประกาย
    createConfetti();
    createHeartBurst(24);

    // ปิดหน้า Intro อย่างนุ่มนวล
    intro.classList.add("is-closing");

    window.setTimeout(() => {
      intro.hidden = true;
      intro.style.display = "none";

      mainContent.classList.remove("hidden");

      observeRevealElements();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      startSparkles();
    }, 760);
  }

  if (giftButton) {
    giftButton.addEventListener("click", openSurprise);
  }

  /* =========================================
     ENVELOPE LETTER
  ========================================= */

  if (envelope) {
    envelope.addEventListener("click", () => {
      const isOpen = envelope.classList.toggle("open");

      envelope.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      envelope.setAttribute(
        "aria-label",
        isOpen ? "ปิดซองจดหมาย" : "เปิดซองจดหมาย"
      );

      if (envelopeHint) {
        envelopeHint.innerHTML = isOpen
          ? '<span>✧</span> แตะอีกครั้งเพื่อปิดจดหมาย <span>✧</span>'
          : '<span>✧</span> แตะที่ซองจดหมายเพื่อเปิดอ่าน <span>✧</span>';
      }

      if (isOpen) {
        createHeartBurst(16);
      }
    });
  }

  /* =========================================
     FINAL SURPRISE MESSAGE
  ========================================= */

  if (surpriseButton && surpriseMessage) {
    surpriseButton.addEventListener("click", () => {
      const willOpen = surpriseMessage.hidden;

      surpriseMessage.hidden = !willOpen;

      surpriseButton.setAttribute(
        "aria-expanded",
        String(willOpen)
      );

      surpriseButton.innerHTML = willOpen
        ? 'เก็บคำอวยพรนี้ไว้ในใจ <span aria-hidden="true">♡</span>'
        : 'กดรับเซอร์ไพรส์สุดท้าย <span aria-hidden="true">♡</span>';

      if (willOpen) {
        createConfetti(30);
        createHeartBurst(18);

        surpriseMessage.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  }

  /* =========================================
     SCROLL REVEAL
  ========================================= */

  let revealObserver = null;

  function observeRevealElements() {
    const elements = $$(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("active");
      });

      return;
    }

    if (revealObserver) {
      revealObserver.disconnect();
    }

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    elements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* =========================================
     IMAGE LIGHTBOX
  ========================================= */

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxCounter = $("#lightboxCounter");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  function renderLightboxImage() {
    const item = gallery[activeImageIndex];

    if (!item || !lightboxImage) return;

    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent =
        `${String(activeImageIndex + 1).padStart(2, "0")} / ` +
        `${String(gallery.length).padStart(2, "0")}`;
    }

    if (lightboxPrev) {
      lightboxPrev.disabled = gallery.length < 2;
    }

    if (lightboxNext) {
      lightboxNext.disabled = gallery.length < 2;
    }
  }

  function openLightbox(index) {
    if (!lightbox || !gallery.length) return;

    activeImageIndex = (index + gallery.length) % gallery.length;
    lastFocusedElement = document.activeElement;

    renderLightboxImage();

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    if (lightboxClose) {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    if (
      !lightbox ||
      !lightbox.classList.contains("is-open")
    ) {
      return;
    }

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }
  }

  function changeLightboxImage(step) {
    if (!gallery.length) return;

    activeImageIndex =
      (activeImageIndex + step + gallery.length) % gallery.length;

    renderLightboxImage();
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      changeLightboxImage(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      changeLightboxImage(1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // ใช้ Escape เพื่อปิดภาพ และลูกศรเพื่อเปลี่ยนภาพ
  document.addEventListener("keydown", (event) => {
    if (
      !lightbox ||
      !lightbox.classList.contains("is-open")
    ) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      changeLightboxImage(-1);
    }

    if (event.key === "ArrowRight") {
      changeLightboxImage(1);
    }
  });

  /* =========================================
     INITIAL EFFECTS
  ========================================= */

  if (intro) {
    for (let i = 0; i < 7; i += 1) {
      window.setTimeout(createSparkle, i * 420);
    }
  }

  updateMusicButton();
})();

/* =========================================
   AUTO PLAY VIDEO WHEN SCROLL INTO VIEW
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const video = document.querySelector(".memory-video");

    if (!video) return;

    // อนุญาตให้เล่นอัตโนมัติ
    video.muted = true;
    video.playsInline = true;

    const videoObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // เมื่อเลื่อนมาถึงวิดีโอ ให้เล่นอัตโนมัติ
                    video.play().catch(function (error) {
                        console.log(
                            "ไม่สามารถเล่นวิดีโออัตโนมัติได้:",
                            error
                        );
                    });
                } else {
                    // เมื่อเลื่อนออกจากวิดีโอ ให้หยุดเล่น
                    video.pause();
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    videoObserver.observe(video);
});