// main.ts - TypeScript version of the site script

// Helper type for optional query selection
function qs<T extends Element>(selector: string, parent: Document | Element = document): T | null {
  return parent.querySelector<T>(selector);
}

document.addEventListener('DOMContentLoaded', () => {
  // ----- Sticky Navigation Header -----
  const header = document.getElementById('header') as HTMLElement | null;
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // ----- Scroll Active Section Link Observer -----
  const sections = document.querySelectorAll<HTMLElement>('section, footer');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 250) {
        const id = section.getAttribute('id');
        if (id) currentSectionId = id;
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // ----- Mobile Navigation Menu Toggle -----
  const mobileToggle = document.getElementById('mobile-toggle') as HTMLElement | null;
  const navMenu = document.getElementById('nav-menu') as HTMLElement | null;
  const navItems = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (!icon) return;
      if (navMenu.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    // Close mobile nav when clicking a link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as Node;
      if (
        navMenu &&
        mobileToggle &&
        !navMenu.contains(target) &&
        !mobileToggle.contains(target) &&
        navMenu.classList.contains('active')
      ) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });
  }

  // ----- Gallery Filtering -----
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const galleryItems = document.querySelectorAll<HTMLElement>('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ----- Image Lightbox Modal -----
  const lightboxModal = document.getElementById('lightbox-modal') as HTMLElement | null;
  const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const lightboxClose = document.getElementById('lightbox-close') as HTMLElement | null;

  function openLightbox(src: string, alt: string) {
    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
    }
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
    }, 300);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img') as HTMLImageElement | null;
      if (img) openLightbox(img.src, img.alt);
    });
  });

  const instagramItems = document.querySelectorAll<HTMLElement>('.instagram-item');
  instagramItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img') as HTMLImageElement | null;
      if (img) openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // ----- Booking/Reservation Modal -----
  const reservationModal = document.getElementById('reservation-modal') as HTMLElement | null;
  const reservationClose = document.getElementById('reservation-close') as HTMLElement | null;
  const openBookingBtns = document.querySelectorAll<HTMLElement>('.open-booking-btn');
  const reservationModalBody = document.getElementById('reservation-modal-body') as HTMLElement | null;
  const originalModalBodyHTML = reservationModalBody?.innerHTML ?? '';

  const openReservationModal = () => {
    if (reservationModalBody) reservationModalBody.innerHTML = originalModalBodyHTML;
    reAttachFormListener();
    if (reservationModal) {
      reservationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeReservationModal = () => {
    if (reservationModal) reservationModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', openReservationModal);
  });

  if (reservationClose) {
    reservationClose.addEventListener('click', closeReservationModal);
  }
  if (reservationModal) {
    reservationModal.addEventListener('click', (e) => {
      if (e.target === reservationModal) closeReservationModal();
    });
  }

  const reAttachFormListener = () => {
    const form = document.getElementById('booking-form') as HTMLFormElement | null;
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const guestName = (document.getElementById('booking-name') as HTMLInputElement | null)?.value || 'Guest';
      const email = (document.getElementById('booking-email') as HTMLInputElement | null)?.value || '';
      const phone = (document.getElementById('booking-phone') as HTMLInputElement | null)?.value || '';
      const guestCount = (document.getElementById('booking-guests') as HTMLInputElement | null)?.value || '2';
      const bookingDate = (document.getElementById('booking-date') as HTMLInputElement | null)?.value || 'today';
      const bookingTime = (document.getElementById('booking-time') as HTMLInputElement | null)?.value || '19:00';
      const bookingRemarks = (document.getElementById('booking-remarks') as HTMLTextAreaElement | null)?.value || 'None';

      if (!reservationModalBody) return;
      reservationModalBody.innerHTML = `
        <div class="toast-msg" style="padding: 20px 0;">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <h4>Securing your table...</h4>
          <p>Please wait a moment.</p>
        </div>`;

      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: guestName, 
            email, 
            phone, 
            guests: guestCount, 
            date: bookingDate,
            time: bookingTime,
            remarks: bookingRemarks
          })
        });
        const result = await response.json();

        // Trigger Google Analytics Event
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'booking',
            event_label: 'Table Reservation',
            value: parseInt(guestCount, 10)
          });
        }

        if (reservationModalBody) {
          reservationModalBody.innerHTML = `
            <div class="toast-msg" style="padding: 20px 0; animation: fadeIn 0.5s ease forwards;">
              <i class="fa-solid fa-circle-check"></i>
              <h4 style="color: var(--accent-gold);">Table Reserved!</h4>
              <p style="margin-top: 10px;">Thank you, <strong>${guestName}</strong>. Your table for <strong>${guestCount}</strong> guests is reserved for <strong>${bookingDate}</strong>.</p>
              <p style="font-size: 12px; margin-top: 15px; opacity: 0.7;">Confirmation sent to ${email}</p>
            </div>`;
        }
      } catch (error) {
        if (reservationModalBody) {
          reservationModalBody.innerHTML = `
            <div class="toast-msg" style="padding: 20px 0; animation: fadeIn 0.5s ease forwards;">
              <i class="fa-solid fa-triangle-exclamation" style="color: #ff6b6b;"></i>
              <h4 style="color: #ff6b6b;">Booking Error</h4>
              <p style="margin-top: 10px;">Sorry, we couldn't process your booking right now. Please call us instead.</p>
            </div>`;
        }
      }

      setTimeout(() => {
        closeReservationModal();
      }, 4000);
    });
  };

  // Initial attach
  reAttachFormListener();

  // ----- Newsletter Form Submission -----
  const newsletterForm = document.getElementById('newsletter-form') as HTMLFormElement | null;
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]') as HTMLInputElement | null;
      const subscribeBtn = newsletterForm.querySelector('button') as HTMLButtonElement | null;
      if (!emailInput || !subscribeBtn) return;
      const email = emailInput.value;
      subscribeBtn.disabled = true;
      subscribeBtn.innerText = '...';

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (response.ok) {
          emailInput.value = '';
          subscribeBtn.innerText = 'Subscribed!';
          subscribeBtn.style.backgroundColor = 'var(--accent-gold)';
          subscribeBtn.style.color = 'var(--bg-dark)';
        } else {
          subscribeBtn.innerText = 'Error';
        }
      } catch (err) {
        subscribeBtn.innerText = 'Error';
      }

      setTimeout(() => {
        subscribeBtn.disabled = false;
        subscribeBtn.innerText = 'Subscribe';
        subscribeBtn.style.backgroundColor = '';
        subscribeBtn.style.color = '';
      }, 3000);
    });
  }
});
