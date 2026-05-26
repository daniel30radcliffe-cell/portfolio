/**
 * AETHER PORTFOLIO - DYNAMIC LOGIC & INTERACTIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollReveal();
  initCardTilt();
  initFormValidation();
});

/**
 * 1. Dark/Light Theme Handler
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference, otherwise check system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

/**
 * 2. Mobile Menu Toggle
 */
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking on a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 3. Scroll Reveal Animation using IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * 4. Premium Mouse Hover Tilt Effect for Hero Card
 */
function initCardTilt() {
  const card = document.querySelector('.hero-visual-card');
  const wrapper = document.querySelector('.hero-visual');
  
  if (!card || !wrapper) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse position X within wrapper
    const y = e.clientY - rect.top;  // Mouse position Y within wrapper
    
    // Normalize coordinates (from -0.5 to 0.5)
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    // Set max tilt angle (degrees)
    const maxTilt = 15;
    const tiltX = (normalizedY * maxTilt).toFixed(2);
    const tiltY = -(normalizedX * maxTilt).toFixed(2);
    
    // Apply transform and slight shift
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    // Reset back smoothly
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease-out';
  });
  
  wrapper.addEventListener('mouseenter', () => {
    // Remove transition when mouse is moving so tilting is responsive
    card.style.transition = 'none';
  });
}

/**
 * 5. Interactive Form Validation and Submission
 */
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');

  // Validate on blur/input
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      // If error is currently displayed, validate in real time
      const errorSpan = document.getElementById(`${input.id}-error`);
      if (errorSpan && errorSpan.style.display === 'block') {
        validateInput(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Create a premium notification toast
      showToast('Messaggio inviato con successo! Ti risponderò al più presto.');
      form.reset();
      
      // Reset inputs state
      inputs.forEach(input => {
        input.classList.remove('valid');
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) errorSpan.style.display = 'none';
      });
    }
  });
}

function validateInput(input) {
  const errorSpan = document.getElementById(`${input.id}-error`);
  let isValid = true;

  if (input.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(input.value.trim());
  } else if (input.id === 'name') {
    isValid = input.value.trim().length >= 3;
  } else if (input.id === 'message') {
    isValid = input.value.trim().length >= 10;
  }

  if (!isValid) {
    if (errorSpan) errorSpan.style.display = 'block';
    input.style.borderColor = 'hsl(0, 85%, 60%)';
    return false;
  } else {
    if (errorSpan) errorSpan.style.display = 'none';
    input.style.borderColor = 'var(--glass-border)';
    return true;
  }
}

/**
 * Helper: Floating Toast Notification
 */
function showToast(message) {
  // Check if a toast already exists
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerText = message;
  
  // Style toast dynamically
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: 'var(--glass-bg)',
    backdropFilter: 'blur(10px)',
    webkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--accent-primary)',
    color: 'var(--text-primary)',
    padding: '16px 28px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
    zIndex: '1000',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease'
  });

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
