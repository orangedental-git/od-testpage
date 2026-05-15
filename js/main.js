/* ═══════════════════════════════════════════════════════════
   MAIN.JS — Interaktivität
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Navbar scroll state ── */
  const nav = document.querySelector('.nav-glass');
  if (nav) {
    const update = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── 2. Dropdown hover bridge ── */
  function repositionMega(item) {
    const drop = item.querySelector('.nav-drop.mega');
    if (!drop) return;

    // Reset to default CSS centering
    drop.style.left = '';
    drop.style.transform = '';

    const rect = drop.getBoundingClientRect();
    const margin = 12;

    if (rect.left < margin) {
      const shift = margin - rect.left;
      drop.style.left = `calc(50% + ${shift}px)`;
    } else if (rect.right > window.innerWidth - margin) {
      const shift = rect.right - (window.innerWidth - margin);
      drop.style.left = `calc(50% - ${shift}px)`;
    }
  }

  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownItems.forEach(item => {
    let closeTimeout;

    const open = () => {
      clearTimeout(closeTimeout);
      // Close siblings
      dropdownItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.add('open');
      repositionMega(item);
    };

    const close = () => {
      closeTimeout = setTimeout(() => {
        item.classList.remove('open');
      }, 200);
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);

    // Hover bridge: dropdown itself
    const drop = item.querySelector('.nav-drop');
    if (drop) {
      drop.addEventListener('mouseenter', () => clearTimeout(closeTimeout));
      drop.addEventListener('mouseleave', close);
    }

    // Keyboard: toggle on click/enter
    const btn = item.querySelector('button');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        dropdownItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
          repositionMega(item);
        }
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    dropdownItems.forEach(item => item.classList.remove('open'));
  });

  // Reposition open mega menus on resize
  window.addEventListener('resize', () => {
    dropdownItems.forEach(item => {
      if (item.classList.contains('open')) repositionMega(item);
    });
  });

  /* ── 3. Priority Navigation (progressive collapse) ── */
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.mobile-overlay');
  const navGlass = document.querySelector('.nav-glass');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && overlay && navGlass && navMenu) {
    const navItems = Array.from(navMenu.querySelectorAll(':scope > .nav-item'));
    const mobLinks = Array.from(overlay.querySelectorAll('.mob-links > li'));

    function closeOverlay() {
      hamburger.classList.remove('active');
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
      const isOpen = overlay.classList.contains('open');
      hamburger.classList.toggle('active', !isOpen);
      overlay.classList.toggle('open', !isOpen);
      overlay.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeOverlay);
    });

    // Measure and collapse: hide items that don't fit, show them in overlay
    function updatePriorityNav() {
      // 1. Reset: show all desktop items, hide hamburger
      navItems.forEach(item => { item.style.display = ''; });
      hamburger.classList.remove('has-overflow');

      // 2. Measure available space inside nav-glass
      const glassStyle = getComputedStyle(navGlass);
      const innerW = navGlass.clientWidth
        - parseFloat(glassStyle.paddingLeft)
        - parseFloat(glassStyle.paddingRight);
      const glassGap = parseFloat(glassStyle.gap) || 8;
      const logo = navGlass.querySelector('.nav-logo');
      const logoW = logo.offsetWidth;

      // Available width for nav-menu (without hamburger): inner - logo - 1 gap
      let available = innerW - logoW - glassGap;

      // 3. Measure each item
      const menuGap = parseFloat(getComputedStyle(navMenu).gap) || 2;
      const widths = navItems.map(item => item.offsetWidth);
      let total = widths.reduce((s, w) => s + w, 0)
        + menuGap * Math.max(0, widths.length - 1);

      // 4. Everything fits → no hamburger needed
      if (total <= available) {
        mobLinks.forEach(li => { li.style.display = 'none'; });
        if (overlay.classList.contains('open')) closeOverlay();
        return;
      }

      // 5. Need hamburger → recalculate with hamburger width
      hamburger.classList.add('has-overflow');
      const hamW = hamburger.offsetWidth;
      available = innerW - logoW - hamW - 2 * glassGap;

      // 6. Hide items from right until they fit
      const hiddenGroups = new Set();
      for (let i = navItems.length - 1; i >= 0 && total > available; i--) {
        total -= widths[i] + menuGap;
        navItems[i].style.display = 'none';
        // Close dropdown if this item was open
        navItems[i].classList.remove('open');
        if (navItems[i].dataset.navGroup) {
          hiddenGroups.add(navItems[i].dataset.navGroup);
        }
      }

      // 7. Show only overflowed groups in mobile overlay (+ support)
      mobLinks.forEach(li => {
        const g = li.dataset.navGroup;
        li.style.display = (g === 'support' || hiddenGroups.has(g)) ? '' : 'none';
      });

      // 8. If overlay is open but no items overflow anymore, close it
      if (hiddenGroups.size === 0 && overlay.classList.contains('open')) {
        closeOverlay();
      }
    }

    // Run on load, resize, and after fonts load
    updatePriorityNav();
    window.addEventListener('resize', () => {
      requestAnimationFrame(updatePriorityNav);
    });
    document.fonts.ready.then(updatePriorityNav);
  }

  /* ── 4. Scroll reveal (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── 5. Hero Carousel ── */
  const heroCarousel = document.querySelector('.hero-carousel');
  const allPrev = heroCarousel ? heroCarousel.querySelectorAll('.hero-prev') : [];
  const allNext = heroCarousel ? heroCarousel.querySelectorAll('.hero-next') : [];
  if (heroCarousel && allPrev.length && allNext.length) {
    const heroSlides = heroCarousel.querySelectorAll('.hero-slide');
    let heroIndex = 0;
    let heroAutoInterval;

    function showHeroSlide(i) {
      heroSlides.forEach(s => s.classList.remove('active'));
      heroSlides[i].classList.add('active');
    }

    function resetHeroAuto() {
      clearInterval(heroAutoInterval);
      heroAutoInterval = setInterval(() => {
        heroIndex = (heroIndex + 1) % heroSlides.length;
        showHeroSlide(heroIndex);
      }, 6000);
    }

    allPrev.forEach(btn => btn.addEventListener('click', () => {
      heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
      showHeroSlide(heroIndex);
      resetHeroAuto();
    }));

    allNext.forEach(btn => btn.addEventListener('click', () => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
      resetHeroAuto();
    }));

    // Auto-advance every 6s
    resetHeroAuto();
  }

  /* ── 6. Testimonial slider ── */
  const slider = document.querySelector('.t-slider');
  const prevBtn = document.querySelector('.t-prev');
  const nextBtn = document.querySelector('.t-next');
  const dotsContainer = document.querySelector('.t-dots');

  if (slider && prevBtn && nextBtn && dotsContainer) {
    const cards = slider.querySelectorAll('.t-card');
    let currentIndex = 0;

    function showCard(index) {
      cards.forEach(c => c.classList.remove('active'));
      cards[index].classList.add('active');

      const dots = dotsContainer.querySelectorAll('.t-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement('span');
        dot.className = 't-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          currentIndex = i;
          showCard(currentIndex);
        });
        dotsContainer.appendChild(dot);
      }
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      showCard(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      showCard(currentIndex);
    });

    buildDots();
  }

})();
