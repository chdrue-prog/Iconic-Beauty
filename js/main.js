/**
 * Iconic Beauty by Devine - Premium Web Application Script
 * Danish beauty clinic page behaviors and mock booking interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveals();
  initServicesFilter();
  initBeforeAfterSliders();
  initPricingTabs();
  initTestimonialsCarousel();
  initFaqAccordion();
  initBookingModal();
  initContactForm();
  initCookieBanner();
});

/* --- STICKY HEADER --- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --- MOBILE NAVIGATION MENU --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };
  
  hamburger.addEventListener('click', toggleMenu);
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
  
  // Close menu on resize to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
}

/* --- SCROLL REVEAL ANIMATIONS (IntersectionObserver) --- */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animated to keep performance optimal
        observer.unobserve(entry.target);
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  reveals.forEach(element => {
    revealObserver.observe(element);
  });
}

/* --- SERVICES FILTERING (Grid Cards) --- */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.services-filters .filter-btn');
  const serviceCards = document.querySelectorAll('.services-grid .service-card');
  
  if (filterBtns.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-filter');
      
      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'alle' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --- BEFORE/AFTER INTERACTIVE SLIDER DRAG/TOUCH LOGIC --- */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');
  
  sliders.forEach(slider => {
    const after = slider.querySelector('.comparison-after');
    const handle = slider.querySelector('.slider-handle-bar');
    const handleBtn = slider.querySelector('.slider-handle-button');
    
    if (!after || !handle || !handleBtn) return;
    
    let isDragging = false;
    
    const setSliderPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      
      // Clamp between 0% and 100%
      if (pos < 0) pos = 0;
      if (pos > 1) pos = 1;
      
      after.style.clipPath = `polygon(0 0, ${pos * 100}% 0, ${pos * 100}% 100%, 0 100%)`;
      handle.style.left = `${pos * 100}%`;
      handleBtn.style.left = `${pos * 100}%`;
    };
    
    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
      e.preventDefault(); // Prevent text highlights
    });
    
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });
    
    // Touch events for mobile responsiveness
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });
    
    window.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });
  });
}

/* --- PRICING LIST CATEGORY TABS --- */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tabs .filter-btn');
  const priceBlocks = document.querySelectorAll('.price-category-block');
  
  if (tabs.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetCat = tab.getAttribute('data-target');
      
      priceBlocks.forEach(block => {
        if (block.id === targetCat) {
          block.classList.add('active');
        } else {
          block.classList.remove('active');
        }
      });
    });
  });
}

/* --- TESTIMONIALS CAROUSEL --- */
function initTestimonialsCarousel() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.carousel-indicators .indicator-dot');
  
  if (cards.length === 0) return;
  
  let currentIndex = 0;
  let carouselInterval;
  
  const showSlide = (index) => {
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    cards[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  };
  
  const nextSlide = () => {
    let next = (currentIndex + 1) % cards.length;
    showSlide(next);
  };
  
  const startInterval = () => {
    carouselInterval = setInterval(nextSlide, 6000); // Rotate every 6 seconds
  };
  
  const stopInterval = () => {
    clearInterval(carouselInterval);
  };
  
  // Dot triggers
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      stopInterval();
      showSlide(idx);
      startInterval();
    });
  });
  
  // Pause on hover
  const container = document.querySelector('.testimonials-carousel-container');
  if (container) {
    container.addEventListener('mouseenter', stopInterval);
    container.addEventListener('mouseleave', startInterval);
  }
  
  // Initialize
  showSlide(0);
  startInterval();
}

/* --- FAQ ACCORDION --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all open FAQs
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --- CUSTOM INTERACTIVE BOOKING MODAL --- */
function initBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const stepContents = document.querySelectorAll('.booking-step-content');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');
  const bookingConfirmBtn = document.getElementById('bookingConfirmBtn');
  
  const serviceItems = document.querySelectorAll('.booking-service-item');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const dateInput = document.getElementById('bookingDate');
  
  let currentStep = 1;
  let bookingData = {
    serviceId: '',
    serviceName: '',
    serviceDuration: '',
    servicePrice: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  };
  
  // Open modal
  const openModal = (preselectedService = '') => {
    modalOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
    currentStep = 1;
    goToStep(1);
    
    // Clear selections
    serviceItems.forEach(item => item.classList.remove('selected'));
    timeSlotBtns.forEach(btn => btn.classList.remove('selected'));
    
    // Pre-select service if passed
    if (preselectedService) {
      const match = Array.from(serviceItems).find(item => item.getAttribute('data-service') === preselectedService);
      if (match) {
        match.click();
        // Skip step 1 if clicked directly from a service card booking button
        setTimeout(() => {
          nextStep();
        }, 200);
      }
    }
  };
  
  // Close modal
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    // Reset booking data
    bookingData = { serviceId: '', serviceName: '', serviceDuration: '', servicePrice: '', date: '', time: '', name: '', email: '', phone: '', notes: '' };
  };
  
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });
  
  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  
  // Selection Handlers
  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      serviceItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      
      bookingData.serviceId = item.getAttribute('data-service');
      bookingData.serviceName = item.querySelector('.booking-service-name').innerText;
      bookingData.serviceDuration = item.querySelector('.booking-service-details').innerText.split('•')[0].trim();
      bookingData.servicePrice = item.querySelector('.booking-service-price').innerText;
      
      nextStepBtn.removeAttribute('disabled');
    });
  });
  
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      
      bookingData.time = btn.innerText;
      checkDateTimeStepValidity();
    });
  });
  
  dateInput.addEventListener('change', () => {
    bookingData.date = dateInput.value;
    checkDateTimeStepValidity();
  });
  
  // Set min date for datepicker to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  
  const checkDateTimeStepValidity = () => {
    if (bookingData.date && bookingData.time) {
      nextStepBtn.removeAttribute('disabled');
    } else {
      nextStepBtn.setAttribute('disabled', 'true');
    }
  };
  
  // Step Navigation Logic
  const goToStep = (step) => {
    currentStep = step;
    
    // Update step visibility
    stepContents.forEach(content => {
      content.classList.remove('active');
      if (parseInt(content.getAttribute('data-step')) === step) {
        content.classList.add('active');
      }
    });
    
    // Update progress steps
    progressSteps.forEach(p => {
      const s = parseInt(p.getAttribute('data-step'));
      p.classList.remove('active', 'complete');
      if (s === step) {
        p.classList.add('active');
      } else if (s < step) {
        p.classList.add('complete');
      }
    });
    
    // Update footer buttons
    if (step === 1) {
      prevStepBtn.style.display = 'none';
      nextStepBtn.style.display = 'block';
      bookingConfirmBtn.style.display = 'none';
      if (!bookingData.serviceId) {
        nextStepBtn.setAttribute('disabled', 'true');
      } else {
        nextStepBtn.removeAttribute('disabled');
      }
    } else if (step === 2) {
      prevStepBtn.style.display = 'block';
      nextStepBtn.style.display = 'block';
      bookingConfirmBtn.style.display = 'none';
      checkDateTimeStepValidity();
    } else if (step === 3) {
      prevStepBtn.style.display = 'block';
      nextStepBtn.style.display = 'none';
      bookingConfirmBtn.style.display = 'block';
      
      // Update summary fields
      document.getElementById('summaryService').innerText = bookingData.serviceName;
      document.getElementById('summaryDuration').innerText = bookingData.serviceDuration;
      document.getElementById('summaryPrice').innerText = bookingData.servicePrice;
      
      // Format date for Danish view: DD. MM. YYYY
      const d = new Date(bookingData.date);
      const formattedDate = d.toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' });
      document.getElementById('summaryTime').innerText = `${formattedDate} kl. ${bookingData.time}`;
    } else if (step === 4) {
      prevStepBtn.style.display = 'none';
      nextStepBtn.style.display = 'none';
      bookingConfirmBtn.style.display = 'none';
      // Success screen doesn't need footer buttons, user can close modal
    }
  };
  
  const nextStep = () => {
    if (currentStep < 4) goToStep(currentStep + 1);
  };
  
  const prevStep = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };
  
  nextStepBtn.addEventListener('click', nextStep);
  prevStepBtn.addEventListener('click', prevStep);
  
  // Submit Booking Form
  const bookingForm = document.getElementById('bookingDetailsForm');
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Read input fields
    bookingData.name = document.getElementById('clientName').value;
    bookingData.email = document.getElementById('clientEmail').value;
    bookingData.phone = document.getElementById('clientPhone').value;
    bookingData.notes = document.getElementById('clientNotes').value;
    
    // Fill success screen details
    document.getElementById('successServiceName').innerText = bookingData.serviceName;
    document.getElementById('successClientEmail').innerText = bookingData.email;
    
    // Transition to success screen
    goToStep(4);
    
    // Clean inputs
    bookingForm.reset();
  });
}

/* --- CONTACT FORM HANDLER --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccessMsg');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Visually simulate sending
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.setAttribute('disabled', 'true');
    submitBtn.innerHTML = 'Sender beskrivelse...';
    
    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'block';
      
      // Scroll to message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
  });
}

/* --- GDPR COOKIE BANNER --- */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAcceptBtn');
  const declineBtn = document.getElementById('cookieDeclineBtn');
  
  if (!banner) return;
  
  // Check if user already consented
  const consent = localStorage.getItem('cookieConsent');
  
  if (!consent) {
    // Show banner after short delay
    setTimeout(() => {
      banner.style.display = 'block';
    }, 2000);
  }
  
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.style.display = 'none';
  });
  
  declineBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    banner.style.display = 'none';
  });
}
