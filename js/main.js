/* ============================================
   LEGACY CARE AFRICA — Main JS
   ============================================ */

// ---- Dark mode toggle ----
(function () {
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  const root = document.documentElement;
  let currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
      toggle.innerHTML = t === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }

  applyTheme(currentTheme);

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  });
})();

// ---- Sticky header scroll effect ----
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

// ---- Mobile nav toggle ----
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ---- Accordion ----
(function () {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all in same group
      const parent = btn.closest('.accordion-list');
      if (parent) {
        parent.querySelectorAll('.accordion-btn').forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          b.nextElementSibling?.classList.remove('open');
        });
      }

      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        body?.classList.add('open');
      }
    });
  });
})();

// ---- Fade-up on scroll ----
(function () {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
})();

// ---- Contact form (simulated) ----
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message sent ✓';
    btn.disabled = true;
    btn.style.background = 'var(--color-success)';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3500);
  });
})();
