// ---- Force Scroll to Top on Reload ----
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Remove hash from URL to prevent jumping to sections like #services
if (window.location.hash) {
  window.history.replaceState('', document.title, window.location.pathname + window.location.search);
}

window.scrollTo(0, 0);
window.addEventListener('load', () => {
  setTimeout(() => window.scrollTo(0, 0), 10);
});

document.addEventListener('DOMContentLoaded', () => {

  // ---- Sticky Header ----
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ---- Mobile Burger Menu ----
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  // Create mobile nav overlay
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.innerHTML = `
    <a href="#about"    class="nav__link">Про нас</a>
    <a href="#services" class="nav__link">Послуги</a>
    <a href="#pricing"  class="nav__link">Ціни</a>
    <a href="#faq"      class="nav__link">FAQ</a>
    <a href="#contact"  class="nav__link">Безкоштовний урок</a>
  `;
  document.body.appendChild(mobileNav);

  let menuOpen = false;
  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    // Animate burger lines
    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq__answer').style.maxHeight = null;
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Form Submit ----
  window.handleSubmit = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Заявка надіслана! Скоро зв\'яжемося з вами.';
    btn.disabled = true;
    btn.style.background = '#22C55E';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      e.target.reset();
    }, 4000);
  };

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // ---- Theme Switcher ----
  const themeDots = document.querySelectorAll('.theme-dot');
  const root = document.documentElement;

  const setTheme = (themeName) => {
    root.setAttribute('data-theme', themeName);
    localStorage.setItem('lingva-theme', themeName);
    themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-theme') === themeName);
    });
  };

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      setTheme(dot.getAttribute('data-theme'));
    });
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('lingva-theme') || 'mint';
  setTheme(savedTheme);

});
