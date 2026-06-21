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



  // ----- Menu Tab Switching -----
  const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuContents = document.querySelectorAll('.menu-content');

  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      menuTabBtns.forEach(b => {
        b.classList.remove('active');
        (b as HTMLElement).style.color = '#666';
        (b as HTMLElement).style.borderBottomColor = 'transparent';
      });
      menuContents.forEach(c => {
        (c as HTMLElement).style.display = 'none';
        c.classList.remove('active');
      });

      // Add active to clicked
      btn.classList.add('active');
      (btn as HTMLElement).style.color = '#e0b976';
      (btn as HTMLElement).style.borderBottomColor = '#e0b976';
      
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.style.display = 'block';
          // Small timeout to allow display:block to apply before adding class for animation if any
          setTimeout(() => targetContent.classList.add('active'), 10);
        }
      }
    });
  });

  // ----- Menu Carousel -----
  const menuContentsList = document.querySelectorAll('.menu-content');
  menuContentsList.forEach(content => {
    const prevBtn = content.querySelector('.prev-btn');
    const nextBtn = content.querySelector('.next-btn');
    const grid = content.querySelector('.menu-grid');

    if (prevBtn && nextBtn && grid) {
      prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -350, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: 350, behavior: 'smooth' });
      });
    }
  });
  // ----- Form Submissions & Toast -----
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimeout: any;

  function showToast(message: string, isError = false) {
    if (!toast || !toastMsg || !toastIcon) return;
    toastMsg.textContent = message;
    
    if (isError) {
      toast.classList.add('error');
      toastIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    } else {
      toast.classList.remove('error');
      toastIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
    }

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  const pageBookingForm = document.getElementById('page-booking-form') as HTMLFormElement | null;
  if (pageBookingForm) {
    pageBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = pageBookingForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Reserving...'; }
      
      const name = (document.getElementById('page-booking-name') as HTMLInputElement | null)?.value || '';
      const email = (document.getElementById('page-booking-email') as HTMLInputElement | null)?.value || '';
      const phone = (document.getElementById('page-booking-phone') as HTMLInputElement | null)?.value || '';
      const date = (document.getElementById('page-booking-date') as HTMLInputElement | null)?.value || '';
      const time = (document.getElementById('page-booking-time') as HTMLInputElement | null)?.value || '';
      const maleCount = (document.getElementById('page-booking-male') as HTMLInputElement | null)?.value || '0';
      const femaleCount = (document.getElementById('page-booking-female') as HTMLInputElement | null)?.value || '0';
      const outlet = (document.getElementById('page-booking-outlet') as HTMLSelectElement | null)?.value || '';
      
      let totalGuests = parseInt(maleCount) + parseInt(femaleCount);
      if (isNaN(totalGuests) || totalGuests <= 0) totalGuests = 1;

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name, email, phone, 
            guests: totalGuests.toString(), 
            date, time, 
            remarks: `Outlet: ${outlet} | Male: ${maleCount} | Female: ${femaleCount}` 
          })
        });
        if (res.ok) {
          showToast('Table reserved successfully! We will contact you soon.');
          pageBookingForm.reset();
        } else {
          showToast('Error sending booking request. Please try again.', true);
        }
      } catch (err) {
        showToast('Error sending booking request. Please try again.', true);
      }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Book Now'; }
    });
  }

  const modalBookingForm = document.getElementById('booking-form') as HTMLFormElement | null;
  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = modalBookingForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Reserving...'; }
      
      const name = (document.getElementById('booking-name') as HTMLInputElement | null)?.value || '';
      const email = (document.getElementById('booking-email') as HTMLInputElement | null)?.value || '';
      const phone = (document.getElementById('booking-phone') as HTMLInputElement | null)?.value || '';
      const date = (document.getElementById('booking-date') as HTMLInputElement | null)?.value || '';
      const time = (document.getElementById('booking-time') as HTMLInputElement | null)?.value || '';
      const guests = (document.getElementById('booking-guests') as HTMLInputElement | null)?.value || '1';
      const remarks = (document.getElementById('booking-remarks') as HTMLInputElement | null)?.value || '';

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, guests, date, time, remarks })
        });
        if (res.ok) {
          showToast('Table reserved successfully! We will contact you soon.');
          modalBookingForm.reset();
          const resModal = document.getElementById('reservation-modal');
          if (resModal) resModal.style.display = 'none';
        } else {
          showToast('Error sending booking request. Please try again.', true);
        }
      } catch (err) {
        showToast('Error sending booking request. Please try again.', true);
      }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Book Now'; }
    });
  }

  const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showToast('Message sent successfully! We will get back to you.');
      contactForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletter-form') as HTMLFormElement | null;
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]') as HTMLInputElement | null;
      const submitBtn = newsletterForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      
      if (!emailInput) return;
      const email = emailInput.value;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = '...'; }

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (res.ok) {
          showToast('Successfully subscribed to our newsletter!');
          newsletterForm.reset();
        } else {
          showToast('Error subscribing to newsletter. Please try again.', true);
        }
      } catch (err) {
        showToast('Error subscribing to newsletter. Please try again.', true);
      }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Subscribe'; }
    });
  }

});
