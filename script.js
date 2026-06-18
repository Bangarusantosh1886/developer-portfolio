document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // 1. Dark/Light Theme Toggle
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Retrieve saved theme or check system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  let currentTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    currentTheme = nextTheme;
  });

  // ==========================================================================
  // 2. Mobile Navigation Menu Overlay
  // ==========================================================================
  const menuTrigger = document.getElementById('mobile-menu-trigger');
  const mobileMenu = document.getElementById('mobile-menu');
  
  // Create backdrop element dynamically
  const backdrop = document.createElement('div');
  backdrop.className = 'menu-backdrop';
  document.body.appendChild(backdrop);

  const toggleMobileMenu = () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      backdrop.classList.add('active');
      document.body.classList.add('mobile-menu-open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  };

  menuTrigger.addEventListener('click', toggleMobileMenu);
  backdrop.addEventListener('click', toggleMobileMenu);

  // Close menu when clicking a mobile nav link
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // ==========================================================================
  // 3. Sticky Header Shrink on Scroll
  // ==========================================================================
  const header = document.getElementById('header');
  
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll);
  // Run once on load to handle page refresh scrolled states
  handleHeaderScroll();

  // ==========================================================================
  // 4. Active Navigation Highlighting (Scroll Spy)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120; // Offset for sticky header threshold

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Desktop Links
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Mobile Links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);
  highlightNavOnScroll();

  // ==========================================================================
  // 5. Scroll Reveal Animations
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animation triggered
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 6. Contact Form Validation and Submission
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const feedbackMessage = document.getElementById('form-feedback');

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateField = (input, errorId, condition) => {
    const formGroup = input.closest('.form-group');
    if (condition) {
      formGroup.classList.remove('error');
      return true;
    } else {
      formGroup.classList.add('error');
      return false;
    }
  };

  // Real-time error removal on input
  nameInput.addEventListener('input', () => {
    validateField(nameInput, 'error-name', nameInput.value.trim() !== '');
  });

  emailInput.addEventListener('input', () => {
    validateField(emailInput, 'error-email', emailRegex.test(emailInput.value.trim()));
  });

  messageInput.addEventListener('input', () => {
    validateField(messageInput, 'error-message', messageInput.value.trim() !== '');
  });

  // Form submit handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform all validations
    const isNameValid = validateField(nameInput, 'error-name', nameInput.value.trim() !== '');
    const isEmailValid = validateField(emailInput, 'error-email', emailRegex.test(emailInput.value.trim()));
    const isMessageValid = validateField(messageInput, 'error-message', messageInput.value.trim() !== '');

    if (isNameValid && isEmailValid && isMessageValid) {
      // Simulate API submission
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader" class="animate-spin"></i>`;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ attrs: { class: 'animate-spin' } });
      }

      setTimeout(() => {
        // Success state
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        feedbackMessage.classList.add('active');

        // Hide success message after 5 seconds
        setTimeout(() => {
          feedbackMessage.classList.remove('active');
        }, 5000);
      }, 1500);
    }
  });

  // Add subtle scroll adjustments for smooth scrolling links
  const allScrollLinks = document.querySelectorAll('a[href^="#"]');
  allScrollLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // 7. Dynamic Carousel Typing Taglines
  // ==========================================================================
  const typedTextSpan = document.getElementById("typed-text");
  const taglines = [
    "Computer Science Student",
    "Full-Stack Developer",
    "Creative Problem Solver",
    "Tech Enthusiast"
  ];
  const typingSpeed = 100;
  const erasingSpeed = 60;
  const nextTaglineDelay = 2000;
  let taglineIndex = 0;
  let charIndex = 0;

  const typeEffect = () => {
    if (charIndex < taglines[taglineIndex].length) {
      typedTextSpan.textContent += taglines[taglineIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeEffect, typingSpeed);
    } else {
      setTimeout(eraseEffect, nextTaglineDelay);
    }
  };

  const eraseEffect = () => {
    if (charIndex > 0) {
      typedTextSpan.textContent = taglines[taglineIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(eraseEffect, erasingSpeed);
    } else {
      taglineIndex = (taglineIndex + 1) % taglines.length;
      setTimeout(typeEffect, typingSpeed + 300);
    }
  };

  // Start the typing effect if the span exists
  if (typedTextSpan) {
    setTimeout(typeEffect, 1000);
  }
});

