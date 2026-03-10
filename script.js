(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    function setMenuOpen(isOpen) {
      navToggle.classList.toggle('is-open', isOpen);
      navLinks.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function isMenuOpen() {
      return navLinks.classList.contains('is-open');
    }

    navToggle.addEventListener('click', function () {
      setMenuOpen(!isMenuOpen());
    });

    // Close menu when clicking a link (for anchor links)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!isMenuOpen()) return;
      if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
      setMenuOpen(false);
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!isMenuOpen()) return;
      setMenuOpen(false);
      navToggle.focus();
    });
  }

  // Active section highlight (scroll spy)
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (navAnchors && navAnchors.length) {
    var sectionEls = [];
    navAnchors.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) sectionEls.push(section);
    });

    function setActiveSection(id) {
      navAnchors.forEach(function (a) {
        var isActive = a.getAttribute('href') === '#' + id;
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }

    if ('IntersectionObserver' in window) {
      var activeId = '';
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute('id') || '';
          if (!id || id === activeId) return;
          activeId = id;
          setActiveSection(id);
        });
      }, { root: null, rootMargin: '-35% 0px -60% 0px', threshold: 0.01 });

      sectionEls.forEach(function (el) { io.observe(el); });
    } else {
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          ticking = false;
          var best = null;
          sectionEls.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top <= 120) best = el;
          });
          if (best) setActiveSection(best.id);
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }
})();
