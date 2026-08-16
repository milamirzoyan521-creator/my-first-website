// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close the mobile menu automatically after tapping a link
document.querySelectorAll('#mainNav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Header goes "glass" once you scroll past the top ----------
const siteHeader = document.getElementById('siteHeader');

const updateHeaderState = () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

// ---------- Scroll-reveal ----------
// Any element with data-reveal fades/slides in the first time it
// enters the viewport. Skipped entirely if the visitor's system
// prefers reduced motion.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('[data-reveal]');

if (prefersReducedMotion) {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

// ---------- Contact form confirmation ----------
// Swaps the form for a "thank you" panel on submit. This is a UI-only
// confirmation for now — actual email delivery needs a backend once
// the site is hosted.
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const sendAnotherBtn = document.getElementById('sendAnotherBtn');

if (contactForm && formSuccess && sendAnotherBtn) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.hidden = true;
    formSuccess.hidden = false;
    contactForm.reset();
  });

  sendAnotherBtn.addEventListener('click', () => {
    formSuccess.hidden = true;
    contactForm.hidden = false;
    contactForm.querySelector('#name').focus();
  });
}
