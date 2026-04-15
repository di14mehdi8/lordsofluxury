/* ============================================================
   LORDS OF LUXURY — Main JavaScript
   ============================================================ */

'use strict';

/* ---------- Scroll effects ---------- */
const header = document.getElementById('site-header');
const scrollProgress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');

function onScroll() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollY / docHeight) * 100;

  // Header
  if (header) {
    header.classList.toggle('scrolled', scrollY > 60);
  }

  // Progress bar
  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  // Back to top
  if (backToTop) {
    backToTop.classList.toggle('visible', scrollY > 500);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Mobile Navigation ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileNavClose = document.querySelector('.mobile-nav-close');

function openMobileNav() {
  mobileNav?.classList.add('open');
  mobileNavOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav?.classList.remove('open');
  mobileNavOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

menuToggle?.addEventListener('click', openMobileNav);
mobileNavClose?.addEventListener('click', closeMobileNav);
mobileNavOverlay?.addEventListener('click', closeMobileNav);

/* ---------- Intersection Observer — fade animations ---------- */
const fadeElements = document.querySelectorAll('.fade-up, .fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

fadeElements.forEach(el => observer.observe(el));

/* ---------- Product filter ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    productCards.forEach(card => {
      const show = cat === 'all' || card.dataset.category === cat;
      card.style.display = show ? '' : 'none';
      if (show) {
        requestAnimationFrame(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      }
    });
  });
});

/* ---------- FAQ Accordion ---------- */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqItems.forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---------- Quick View Modal ---------- */
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const modalImage = document.querySelector('.modal-img');
const modalName = document.querySelector('.modal-product-name');
const modalPrice = document.querySelector('.modal-product-price');
const modalDesc = document.querySelector('.modal-product-desc');
const modalCategory = document.querySelector('.modal-product-category');

function openModal(data) {
  if (!modalOverlay) return;
  if (modalImage) modalImage.src = data.img || '';
  if (modalName) modalName.textContent = data.name || '';
  if (modalPrice) modalPrice.textContent = data.price || '';
  if (modalDesc) modalDesc.textContent = data.desc || '';
  if (modalCategory) modalCategory.textContent = data.category || '';
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

document.querySelectorAll('[data-quickview]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const card = btn.closest('.product-card');
    if (!card) return;
    openModal({
      img: card.querySelector('img')?.src || '',
      name: card.querySelector('.product-name')?.textContent || '',
      price: card.querySelector('.product-price')?.textContent || '',
      desc: card.querySelector('.product-meta')?.textContent || '',
      category: card.dataset.category || '',
    });
  });
});

/* ---------- Keyboard navigation ---------- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeMobileNav();
  }
});

/* ---------- Lazy load images ---------- */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ---------- Marquee duplicate ---------- */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const clone = marqueeTrack.innerHTML;
  marqueeTrack.innerHTML += clone;
}

/* ---------- Smooth reveal on load ---------- */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Trigger initial scroll check
  onScroll();
});

/* ---------- Newsletter form ---------- */
const newsletterForm = document.querySelector('.newsletter-form-el');
newsletterForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = newsletterForm.querySelector('input[type="email"]')?.value;
  if (email) {
    const btn = newsletterForm.querySelector('.newsletter-btn');
    if (btn) {
      btn.textContent = 'Thank You!';
      btn.style.background = '#2a7a2a';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
        btn.style.color = '';
        newsletterForm.reset();
      }, 3000);
    }
  }
});

/* ---------- Contact form ---------- */
const contactForm = document.querySelector('.contact-form-el');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('[type="submit"]');
  if (btn) {
    const original = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  }
});

/* ---------- Announce bar dismiss ---------- */
const announceBar = document.querySelector('.announcement-bar');
let announceDismiss = document.querySelector('.announce-dismiss');
if (announceBar && !announceDismiss) {
  announceDismiss = document.createElement('button');
  announceDismiss.className = 'announce-dismiss';
  announceDismiss.setAttribute('aria-label', 'Dismiss announcement');
  announceDismiss.innerHTML = '&times;';
  announceBar.appendChild(announceDismiss);
}
const dismissAnnounce = () => {
  announceBar?.style.setProperty('display', 'none');
  document.body.classList.add('announce-dismissed');
  sessionStorage.setItem('announce_dismissed', '1');
};
announceDismiss?.addEventListener('click', dismissAnnounce);
if (sessionStorage.getItem('announce_dismissed') === '1') {
  dismissAnnounce();
}
