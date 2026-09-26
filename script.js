/**
 * GB ENTERPRISES — INDUSTRIAL ROBOTICS & AUTOMATION
 * Production JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. DOM Elements ---
  const preloader = document.getElementById('preloader');
  const heroVideo = document.getElementById('hero-video');
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
  const backToTopBtn = document.getElementById('back-to-top');
  const yearEl = document.getElementById('year');

  // Lightbox Elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const galleryCards = document.querySelectorAll('.gallery-card');

  // --- 2. Dynamic Copyright Year ---
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- 3. Preloader & Video Synchronization ---
  if (preloader) {
    let isVideoReady = false;
    let isMinTimeElapsed = false;
    let isDismissed = false;

    const dismissPreloader = () => {
      if (isDismissed) return;
      if (isMinTimeElapsed && (isVideoReady || !heroVideo)) {
        isDismissed = true;
        if (heroVideo) {
          heroVideo.play().catch(() => {});
        }
        preloader.classList.add('is-loaded');
        document.body.classList.remove('loading');

        setTimeout(() => {
          preloader.style.display = 'none';
        }, 1200);
      }
    };

    // Minimum display time for gear animations
    setTimeout(() => {
      isMinTimeElapsed = true;
      dismissPreloader();
    }, 2200);

    // Fallback safety timeout
    setTimeout(() => {
      if (!isDismissed) {
        isMinTimeElapsed = true;
        isVideoReady = true;
        dismissPreloader();
      }
    }, 3200);

    // Video buffering checks
    if (heroVideo) {
      if (heroVideo.readyState >= 2) {
        isVideoReady = true;
        dismissPreloader();
      } else {
        const onReady = () => {
          isVideoReady = true;
          dismissPreloader();
        };
        heroVideo.addEventListener('loadeddata', onReady, { once: true });
        heroVideo.addEventListener('canplay', onReady, { once: true });
        heroVideo.addEventListener('playing', onReady, { once: true });
        heroVideo.addEventListener('error', () => {
          isVideoReady = true;
          dismissPreloader();
        }, { once: true });
      }
    }
  }

  // --- 4. Mobile Navigation Menu ---
  if (menuToggle && primaryNav) {
    const toggleMenu = () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Auto-close on nav item click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('open')) {
          primaryNav.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        primaryNav.classList.contains('open') &&
        !primaryNav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        primaryNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 5. Scroll-Spy & Sticky Header Styling ---
  const sections = document.querySelectorAll('main section[id]');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header background change
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Tracking
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 6. Back to Top Smooth Scroll ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --- 7. Fullscreen Image Lightbox Modal ---
  const openLightbox = (imgSrc, title) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const fullImg = card.getAttribute('data-full-img');
      const title = card.getAttribute('data-title') || 'Project Showcase';
      if (fullImg) {
        openLightbox(fullImg, title);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
});
