document.getElementById('footer-year').textContent = '© ' + new Date().getFullYear();

// ═══════════════════════════════════════════════════════════════════
// Navigation Background Change on Scroll  
// ═══════════════════════════════════════════════════════════════════

const nav = document.querySelector('nav');

const handleNavBg = () => {
  if (window.scrollY < 50) {
    nav.classList.add('transparent');
  } else {
    nav.classList.remove('transparent');
  }
};

// Run on load and on scroll
handleNavBg();
window.addEventListener('scroll', handleNavBg);

// ═══════════════════════════════════════════════════════════════════
// THEME TOGGLE FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark mode
const getSavedTheme = () => {
  const saved = localStorage.getItem('theme-preference');
  if (saved) return saved;

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'dark'; // Default to dark
};

// Initialize theme on page load
const initTheme = () => {
  const theme = getSavedTheme();
  applyTheme(theme);
};

// Apply theme to the document
const applyTheme = (theme) => {
  if (theme === 'light') {
    htmlElement.classList.add('light-theme');
    localStorage.setItem('theme-preference', 'light');
    updateToggleIcon('moon'); // Moon icon in light mode
  } else {
    htmlElement.classList.remove('light-theme');
    localStorage.setItem('theme-preference', 'dark');
    updateToggleIcon('sun'); // Sun icon in dark mode
  }
};

// Update the toggle button icon
const updateToggleIcon = (icon) => {
  if (themeToggle) {
    themeToggle.innerHTML = `<i data-lucide="${icon}"></i>`;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
};

// Toggle theme on button click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme-preference')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════════════════════

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// ═══════════════════════════════════════════════════════════════════
// SCROLL PROGRESS
// ═══════════════════════════════════════════════════════════════════

const progressBar = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
  if (!progressBar) return;

  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;

  progressBar.style.width = scrolled + "%";
});

// ═══════════════════════════════════════════════════════════════════
// DRAGGABLE TECH STRIP
// ═══════════════════════════════════════════════════════════════════

const strip = document.querySelector('.tech-drag-strip');
const track = document.querySelector('.tech-drag-track');

if (strip && track) {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let velocity = 0;
  let lastX = 0;
  let animFrame;

  strip.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
    lastX = e.pageX;
    velocity = 0;
    cancelAnimationFrame(animFrame);
    strip.style.cursor = 'grabbing';
  });

  strip.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    velocity = e.pageX - lastX;
    lastX = e.pageX;
    const x = e.pageX - strip.offsetLeft;
    const walk = (x - startX) * 1.2;
    strip.scrollLeft = scrollLeft - walk;
  });

  const stopDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    strip.style.cursor = 'grab';
    // momentum
    const momentum = () => {
      if (Math.abs(velocity) < 0.5) return;
      strip.scrollLeft -= velocity;
      velocity *= 0.92;
      animFrame = requestAnimationFrame(momentum);
    };
    momentum();
  };

  strip.addEventListener('mouseup', stopDrag);
  strip.addEventListener('mouseleave', stopDrag);

  // Touch support
  strip.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
    lastX = e.touches[0].pageX;
    velocity = 0;
    cancelAnimationFrame(animFrame);
  }, { passive: true });

  strip.addEventListener('touchmove', (e) => {
    velocity = e.touches[0].pageX - lastX;
    lastX = e.touches[0].pageX;
    const x = e.touches[0].pageX - strip.offsetLeft;
    strip.scrollLeft = scrollLeft - (x - startX);
  }, { passive: true });

  strip.addEventListener('touchend', stopDrag);
}

// ═══════════════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════════

// Initialize EmailJS
(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init("nD74GJ8C4FvV5O_U9");
  } else {
    console.error("EmailJS SDK not loaded correctly.");
  }
})();

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.contact-submit');

    // Disable button
    btn.disabled = true;
    btn.innerHTML = 'Sending...';
    status.textContent = '';

    // Send email to YOU
    emailjs.sendForm("service_hyd1f6k", "template_3fjf0ep", form)
      .then(() => {

        // Auto-reply to USER
        return emailjs.sendForm("service_hyd1f6k", "template_b4brh8k", form);

      })
      .then(() => {

        status.style.opacity = '1';
        status.style.color = '#28C840';
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';

        form.reset();

        // Fade out message
        setTimeout(() => {
          status.style.opacity = '0';
          setTimeout(() => {
            status.textContent = '';
            status.style.opacity = '1';
          }, 500);
        }, 4000);

      })
      .catch((error) => {
        console.error("EmailJS Error:", error);

        status.style.color = '#FF5F57';
        status.textContent = '✕ Failed to send. Try again.';
      })
      .finally(() => {

        btn.disabled = false;
        btn.innerHTML = 'Send Message <i data-lucide="send" class="icon-sm"></i>';

        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
  });
}