/* ============================================
   AquaShine Car Wash - Vanilla JavaScript
   ============================================ */

// ============================================
// Utility Functions
// ============================================
function $(selector) {
    return document.querySelector(selector);
  }
  
  function $$(selector) {
    return document.querySelectorAll(selector);
  }
  
  // ============================================
  // Toast Notifications
  // ============================================
  const Toast = {
    container: null,
    
    init() {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    },
    
    show(title, description, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
      `;
      
      this.container.appendChild(toast);
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
  };
  
  // ============================================
  // Navbar
  // ============================================
  const Navbar = {
    init() {
      const mobileBtn = $('.navbar-mobile-btn');
      const mobileMenu = $('.navbar-mobile');
      
      if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
          const isOpen = mobileMenu.classList.toggle('open');
          const icon = mobileBtn.querySelector('svg');
          
          if (isOpen) {
            icon.innerHTML = `
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            `;
          } else {
            icon.innerHTML = `
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            `;
          }
        });
      }
      
      // Set active link
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      $$('.navbar-link, .navbar-mobile-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  };
  
  // ============================================
  // Hero Section (Image Slider)
  // ============================================
  const HeroSlider = {
    currentIndex: 0,
    images: [],
    indicators: [],
    interval: null,
    
    init() {
      this.images = $$('.hero-bg');
      this.indicators = $$('.hero-indicator');
      
      if (this.images.length === 0) return;
      
      // Set first image as active
      this.setActive(0);
      
      // Start auto-rotation
      this.startAutoRotation();
      
      // Add click handlers to indicators
      this.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          this.setActive(index);
          this.resetAutoRotation();
        });
      });
    },
    
    setActive(index) {
      this.images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
      this.indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
      });
      this.currentIndex = index;
    },
    
    next() {
      const nextIndex = (this.currentIndex + 1) % this.images.length;
      this.setActive(nextIndex);
    },
    
    startAutoRotation() {
      this.interval = setInterval(() => this.next(), 5000);
    },
    
    resetAutoRotation() {
      clearInterval(this.interval);
      this.startAutoRotation();
    }
  };
  
  // ============================================
  // Services Page - Wash Type Selection
  // ============================================
  const WashTypeSelector = {
    selectedType: null,
    
    init() {
      const cards = $$('.wash-type-card');
      
      cards.forEach(card => {
        card.addEventListener('click', () => {
          // Remove selection from all cards
          cards.forEach(c => c.classList.remove('selected'));
          
          // Add selection to clicked card
          card.classList.add('selected');
          this.selectedType = card.dataset.washType;
        });
      });
    },
    
    getSelected() {
      return this.selectedType;
    }
  };
  
  // ============================================
  // Services Form Handler
  // ============================================
  const ServicesForm = {
    init() {
      const form = $('#services-form');
      if (!form) return;
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const vehicleType = $('#vehicle-type').value;
        const vehicleBrand = $('#vehicle-brand').value;
        const vehicleModel = $('#vehicle-model').value;
        const washType = WashTypeSelector.getSelected();
        
        // Validation
        if (!vehicleType || !vehicleBrand || !vehicleModel) {
          Toast.show('Please fill all fields', 'All vehicle information is required.', 'error');
          return;
        }
        
        if (!washType) {
          Toast.show('Please select a wash type', 'Choose a wash package to continue.', 'error');
          return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          
          Toast.show('Vehicle Registered!', 'Your vehicle has been registered and wash scheduled.', 'success');
          
          // Reset form
          form.reset();
          $$('.wash-type-card').forEach(c => c.classList.remove('selected'));
          WashTypeSelector.selectedType = null;
        }, 1500);
      });
    }
  };
  
  // ============================================
  // Contact Form Handler
  // ============================================
  const ContactForm = {
    init() {
      const form = $('#contact-form');
      if (!form) return;
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          
          Toast.show('Message sent!', "We'll get back to you as soon as possible.", 'success');
          form.reset();
        }, 1500);
      });
    }
  };
  
  // ============================================
  // Auth Forms Handler
  // ============================================
  const AuthForms = {
    init() {
      this.initLoginForm();
      this.initRegisterForm();
      this.initPasswordToggle();
    },
    
    initLoginForm() {
      const form = $('#login-form');
      if (!form) return;
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          Toast.show('Welcome back!', 'You have successfully logged in.', 'success');
          setTimeout(() => {
            window.location.href = 'services.html';
          }, 1000);
        }, 1500);
      });
    },
    
    initRegisterForm() {
      const form = $('#register-form');
      if (!form) return;
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = $('#register-password').value;
        const confirmPassword = $('#confirm-password').value;
        
        if (password !== confirmPassword) {
          Toast.show("Passwords don't match", 'Please make sure your passwords match.', 'error');
          return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          Toast.show('Account created!', 'Welcome to AquaShine. You can now log in.', 'success');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1000);
        }, 1500);
      });
    },
    
    initPasswordToggle() {
      $$('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
          const input = toggle.parentElement.querySelector('input');
          const isPassword = input.type === 'password';
          
          input.type = isPassword ? 'text' : 'password';
          
          const svg = toggle.querySelector('svg');
          if (isPassword) {
            // Eye off icon
            svg.innerHTML = `
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
              <line x1="2" x2="22" y1="2" y2="22"></line>
            `;
          } else {
            // Eye icon
            svg.innerHTML = `
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            `;
          }
        });
      });
    }
  };
  
  // ============================================
  // Initialize Everything
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    Toast.init();
    Navbar.init();
    HeroSlider.init();
    WashTypeSelector.init();
    ServicesForm.init();
    ContactForm.init();
    AuthForms.init();
  });
  