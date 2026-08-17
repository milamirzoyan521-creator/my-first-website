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

// ---------- Contact form submission ----------
// Submits the form to Formspree over fetch (AJAX) so the page never
// reloads. The "thank you" panel is shown ONLY after Formspree confirms
// a successful submission; any failure surfaces an inline error instead.
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const sendAnotherBtn = document.getElementById('sendAnotherBtn');

if (contactForm && formSuccess && formError && sendAnotherBtn) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  const showError = (message) => {
    formError.textContent = message;
    formError.hidden = false;
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset any previous error and show a pending state on the button.
    formError.hidden = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        // Real success — swap in the thank-you panel.
        contactForm.hidden = true;
        formSuccess.hidden = false;
        contactForm.reset();
      } else {
        // Formspree returns a JSON body with field-level error messages.
        const data = await response.json().catch(() => null);
        const message =
          data && Array.isArray(data.errors) && data.errors.length
            ? data.errors.map((err) => err.message).join(' ')
            : 'Sorry, something went wrong sending your message. Please try again.';
        showError(message);
      }
    } catch (err) {
      // Network failure, offline, etc. — nothing was submitted.
      showError('Could not reach the server. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  sendAnotherBtn.addEventListener('click', () => {
    formSuccess.hidden = true;
    formError.hidden = true;
    contactForm.hidden = false;
    contactForm.querySelector('#name').focus();
  });
}
