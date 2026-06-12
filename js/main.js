/* =========================================
   ZIROBA MÉXICO — Main JavaScript v2
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar scroll shadow ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- Mobile hamburger ---------- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Active nav link ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/^\.\//, '');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Burbujas decorativas ----------
     Cualquier sección con [data-bubbles] recibe burbujas
     flotantes (limpieza = burbujas). Se omiten si el usuario
     prefiere menos movimiento. */
  if (!reducedMotion) {
    document.querySelectorAll('[data-bubbles]').forEach(zone => {
      const count = parseInt(zone.dataset.bubbles, 10) || 14;
      const cs = getComputedStyle(zone);
      if (cs.position === 'static') zone.style.position = 'relative';
      for (let i = 0; i < count; i++) {
        const b = document.createElement('span');
        b.className = 'bubble';
        const size = 8 + Math.random() * 42;
        b.style.width = size + 'px';
        b.style.height = size + 'px';
        b.style.left = Math.random() * 100 + '%';
        b.style.animationDuration = (9 + Math.random() * 14) + 's';
        b.style.animationDelay = (-Math.random() * 18) + 's';
        zone.appendChild(b);
      }
    });
  }

  /* ---------- Counter animation ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[data-tab-group]').forEach(tabGroup => {
    const group = tabGroup.dataset.tabGroup;
    const buttons = document.querySelectorAll(`[data-tab="${group}"]`);
    const panels = document.querySelectorAll(`[data-tab-panel="${group}"]`);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabTarget;
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`[data-tab-panel="${group}"][data-panel="${target}"]`)?.classList.add('active');
      });
    });
  });

  /* ---------- Hero parallax (sutil) ---------- */
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768 && !reducedMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      hero.style.backgroundPositionY = `calc(50% + ${y * 0.3}px)`;
    }, { passive: true });
  }

  /* ---------- Back to top global ----------
     Se inyecta en todas las páginas que no traigan el suyo. */
  if (!document.getElementById('backToTop')) {
    const topBtn = document.createElement('button');
    topBtn.id = 'backToTop';
    topBtn.className = 'back-to-top';
    topBtn.setAttribute('aria-label', 'Volver al inicio');
    topBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
    document.body.appendChild(topBtn);
    window.addEventListener('scroll', () => {
      topBtn.classList.toggle('visible', window.scrollY > 700);
    }, { passive: true });
  }

  /* ---------- Form submit — Web3Forms ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.textContent = 'Enviando...';
      btn.disabled = true;

      const formData = new FormData(form);

      // Inyectar clave desde config.js
      if (typeof ZIROBA_CONFIG !== 'undefined') {
        formData.set('access_key', ZIROBA_CONFIG.web3formsKey);
      }

      // Convierte checkboxes múltiples en una cadena legible
      const checkboxes = [...form.querySelectorAll('input[type="checkbox"][name="productos"]:checked')]
        .map(cb => cb.value);
      if (checkboxes.length) formData.set('productos', checkboxes.join(', '));

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.success) {
          btn.textContent = '¡Enviado!';
          btn.style.background = '#2ECC71';

          const downloadUrl = form.dataset.download;
          if (downloadUrl) {
            showToast('¡Listo! Tu descarga comenzará en un momento.');
            setTimeout(() => {
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = '';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }, 800);
          } else {
            showToast('¡Gracias! Nos pondremos en contacto contigo pronto.');
          }

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.style.background = '';
            form.reset();
          }, 3500);
        } else {
          throw new Error(data.message);
        }
      } catch {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        showToast('Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.');
      }
    });
  });

  /* ---------- Toast notification ---------- */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; bottom: 110px; right: 28px; z-index: 300;
      background: #0A2C50; color: white; padding: 16px 22px;
      border-radius: 14px; font-size: .95rem; font-weight: 700;
      box-shadow: 0 8px 30px rgba(10,44,80,.35);
      border: 1px solid rgba(79,208,255,.4);
      transform: translateY(20px); opacity: 0;
      transition: all .3s ease; max-width: 320px; line-height: 1.4;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Product image placeholder color cycle ---------- */
  const colors = ['#E7F6FF', '#FFF6E3', '#F0FFF4', '#F2F8FD'];
  document.querySelectorAll('.product-card__img-wrap').forEach((wrap, i) => {
    if (!wrap.getAttribute('style') || !wrap.getAttribute('style').includes('background')) {
      wrap.style.background = colors[i % colors.length];
    }
  });

});
