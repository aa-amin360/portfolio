document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Scroll Progress Bar
  const progressBar = document.querySelector('#scrollProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });

  // 3. Active Nav Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-nav');
      }
    });
  });

  // 4. Mobile Navigation Toggle
  const navToggle = document.querySelector('#navToggle');
  const navMenu = document.querySelector('#navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 5. Spotlight Effect on Cards
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 6. 3D Card Tilt Physics (Desktop Only)
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });

    // 7. Magnetic Button Physics
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 8. Animated Number Counters
  const counters = document.querySelectorAll('.counter');
  let hasCounted = false;

  const runCounters = () => {
    counters.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 35;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.textContent = `${prefix}${Math.ceil(count)}${suffix}`;
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${prefix}${target}${suffix}`;
        }
      };
      updateCount();
    });
  };

  // 9. Scroll Reveal Animations (Intersection Observer)
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // Trigger counter when hero section appears
          if (!hasCounted && entry.target.closest('.hero-section')) {
            runCounters();
            hasCounted = true;
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
    runCounters();
  }

  // 10. Copy Email Feature
  const copyBtn = document.querySelector('.copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email');
      const textSpan = copyBtn.querySelector('.btn-text');
      const originalText = textSpan.textContent;

      try {
        await navigator.clipboard.writeText(email);
        textSpan.textContent = 'Copied to Clipboard!';
        copyBtn.style.borderColor = 'rgba(5, 150, 105, 0.4)';
        copyBtn.style.color = '#059669';

        setTimeout(() => {
          textSpan.textContent = originalText;
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }
});