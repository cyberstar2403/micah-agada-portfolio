(() => {
  'use strict';

  /* ---- Configuration ------------------------------------------------------
     WhatsApp: set this to the owner's CONFIRMED WhatsApp number in international
     format with digits only (e.g. '234XXXXXXXXXX'). While empty, the WhatsApp
     icon stays hidden rather than guessing a number. */
  const WHATSAPP_NUMBER = '';
  const CONTACT_EMAIL = 'micahagada8@gmail.com';

  /* Direct sending: paste a form-service endpoint here (e.g. a free Formspree URL
     such as 'https://formspree.io/f/xxxxxxxx', set up to deliver to the email above).
     While empty, the form opens a ready-written message to Micah instead. */
  const FORM_ENDPOINT = '';

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  /* On computers most people use webmail, where mailto: links do nothing — open Gmail's
     compose window instead. On phones, mailto: opens the installed mail app. */
  const composeHref = (subject, body) => isTouch
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  /* Email icon behaves like the WhatsApp icon: opens a compose window addressed to Micah */
  const emailIcon = document.querySelector('.social-icon-link[href^="mailto:"]');
  if (emailIcon && !isTouch) {
    emailIcon.href = composeHref('Hello from your portfolio', 'Hello Micah,\n\n');
    emailIcon.target = '_blank';
    emailIcon.rel = 'noopener noreferrer';
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile navigation ---- */
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  };
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
    });
  }

  /* ---- Active section in navigation ---- */
  const navLinks = [...document.querySelectorAll('.site-nav > a[href^="#"]:not(.nav-cta)')];
  const sections = [...navLinks.map((a) => document.querySelector(a.getAttribute('href'))), document.querySelector('#contact')].filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---- WhatsApp (only shown once a confirmed number is configured) ---- */
  const waLink = document.querySelector('#whatsapp-link');
  const waDigits = WHATSAPP_NUMBER.replace(/\D/g, '');
  if (waLink && waDigits.length >= 8) {
    waLink.href = `https://wa.me/${waDigits}`;
    waLink.hidden = false;
  }

  /* ---- Enquiry form: validate, then open an email draft ---- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const status = form.querySelector('#form-status');
    const fields = {
      name: { el: form.querySelector('#visitor-name'), err: form.querySelector('#err-name'), msg: 'Please enter your full name.' },
      email: { el: form.querySelector('#visitor-email'), err: form.querySelector('#err-email'), msg: 'Please enter a valid email address, like name@example.com.' },
      service: { el: form.querySelector('#visitor-service'), err: form.querySelector('#err-service'), msg: 'Please choose the service you need.' },
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const isValid = (key) => {
      const value = fields[key].el.value.trim();
      return key === 'email' ? emailPattern.test(value) : value.length > 0;
    };
    const showError = (key, show) => {
      const { el, err, msg } = fields[key];
      err.textContent = show ? msg : '';
      if (show) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    };
    Object.keys(fields).forEach((key) => {
      const el = fields[key].el;
      el.addEventListener('blur', () => { if (el.value !== '') showError(key, !isValid(key)); });
      el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid') && isValid(key)) showError(key, false); });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.innerHTML = '';
      const invalid = Object.keys(fields).filter((key) => { const bad = !isValid(key); showError(key, bad); return bad; });
      if (invalid.length) { fields[invalid[0]].el.focus(); return; }

      const name = fields.name.el.value.trim();
      const email = fields.email.el.value.trim();
      const service = fields.service.el.value.trim();
      const message = form.querySelector('#visitor-message').value.trim();

      const subject = `Portfolio enquiry: ${service}`;
      const body = [
        'Hello Micah,', '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Service required: ${service}`, '',
        'Project details:',
        message || 'Not provided.', '',
        'Sent from your portfolio website.',
      ].join('\r\n');

      const fallback = `If that fails, email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> directly.`;

      if (FORM_ENDPOINT) {
        const button = form.querySelector('.form-submit');
        button.disabled = true;
        status.textContent = 'Sending…';
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, service, message, _subject: subject, _replyto: email }),
        }).then((res) => {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          status.innerHTML = `<strong>Thank you, ${name.replace(/[<>&"]/g, '')}.</strong> Your enquiry has been sent to Micah.`;
        }).catch(() => {
          status.innerHTML = `Sorry, that didn't send. ${fallback}`;
        }).finally(() => { button.disabled = false; });
        return;
      }

      const href = composeHref(subject, body);
      if (isTouch) window.location.href = href; else window.open(href, '_blank', 'noopener');
      status.innerHTML = `A message to Micah is ready in ${isTouch ? 'your email app' : 'a new Gmail tab'}. <strong>Press Send there to deliver it.</strong> ${fallback}`;
    });
  }

  if (FORM_ENDPOINT) {
    const label = document.querySelector('.submit-label'); if (label) label.textContent = 'SEND ENQUIRY';
    const note = document.querySelector('.form-note'); if (note) note.textContent = 'Your enquiry goes straight to Micah’s inbox.';
  }

  /* ---- Focus the name field after the "Start a conversation" link ---- */
  document.querySelectorAll('a[href="#contact-form"]').forEach((link) => {
    link.addEventListener('click', () => {
      const first = document.querySelector('#visitor-name');
      if (first) window.setTimeout(() => first.focus({ preventScroll: true }), reducedMotion ? 0 : 600);
    });
  });

  /* ---- Case-study previews: only show once the image has really loaded ---- */
  document.querySelectorAll('.case-preview img').forEach((img) => {
    const preview = img.closest('.case-preview');
    const reveal = () => { if (img.naturalWidth > 0) preview.classList.add('is-loaded'); };
    if (img.complete) reveal(); else img.addEventListener('load', reveal, { once: true });
  });

  /* ---- Section reveal ---- */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
