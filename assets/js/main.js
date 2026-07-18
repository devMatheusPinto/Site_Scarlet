/**
 * ============================================
 * NUTRIÇÃO RENAL - Main JavaScript
 * Site institucional para clínica médica
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. PRELOADER
  // ============================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => preloader.remove(), 500);
      }
    }, 500);
  });

  // ============================================
  // 2. SCROLL-BASED HEADER
  // ============================================
  const header = document.getElementById('header');
  let lastScrollY = 0;

  const handleHeaderScroll = () => {
    const currentScrollY = window.scrollY;
    if (header) {
      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ============================================
  // 3. SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // 4. MOBILE MENU TOGGLE
  // ============================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // ============================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all elements immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // 6. FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // ============================================
  // 7. TESTIMONIALS CAROUSEL
  // ============================================
  const carousel = document.getElementById('testimonials-carousel');
  
  if (carousel) {
    const track = carousel.querySelector('.testimonials-track');
    const cards = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    let currentSlide = 0;
    const totalSlides = cards.length;
    let autoSlideInterval;
    let slidesPerView = 1;

    // Determine slides per view based on screen width
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        slidesPerView = 2;
      } else {
        slidesPerView = 1;
      }
    };

    updateSlidesPerView();

    // Create dots
    const totalDots = Math.ceil(totalSlides / slidesPerView);
    if (dotsContainer) {
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    const goToSlide = (n) => {
      const maxSlide = totalSlides - slidesPerView;
      currentSlide = Math.max(0, Math.min(n, maxSlide));
      
      if (track) {
        const slideWidth = 100 / slidesPerView;
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
      }
      
      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === Math.floor(currentSlide / slidesPerView));
        });
      }
    };

    const nextSlide = () => {
      const maxSlide = totalSlides - slidesPerView;
      goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
      const maxSlide = totalSlides - slidesPerView;
      goToSlide(currentSlide <= 0 ? maxSlide : currentSlide - 1);
    };

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-advance
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    startAutoSlide();

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Handle resize
    window.addEventListener('resize', () => {
      updateSlidesPerView();
      goToSlide(currentSlide);
    });
  }

  // ============================================
  // 8. STATS COUNTER ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * target);
      
      el.textContent = currentValue.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString('pt-BR') + '+';
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(num => animateCounter(num));
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsRow = document.querySelector('.stats-row');
    if (statsRow) statsObserver.observe(statsRow);
  }

  // ============================================
  // 9. ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => navObserver.observe(section));
  }

  // ============================================
  // 10. BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 11. NEWSLETTER FORM (prevent default)
  // ============================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        // Placeholder: integrate with email service
        alert('Obrigada por se inscrever! Em breve você receberá nossas novidades.');
        input.value = '';
      }
    });
  }

});
