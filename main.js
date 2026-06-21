var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// main.ts - TypeScript version of the site script
// Helper type for optional query selection
function qs(selector, parent = document) {
    return parent.querySelector(selector);
}
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    // ----- Sticky Navigation Header -----
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('sticky');
            }
            else {
                header.classList.remove('sticky');
            }
        });
    }
    // ----- Scroll Active Section Link Observer -----
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 250) {
                const id = section.getAttribute('id');
                if (id)
                    currentSectionId = id;
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
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-links a');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (!icon)
                return;
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            }
            else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
        // Close mobile nav when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon)
                    icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (navMenu &&
                mobileToggle &&
                !navMenu.contains(target) &&
                !mobileToggle.contains(target) &&
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon)
                    icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }
    // ----- Gallery Filtering -----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
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
                }
                else {
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
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    function openLightbox(src, alt) {
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
        if (lightboxModal)
            lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (lightboxImg)
                lightboxImg.src = '';
        }, 300);
    }
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img)
                openLightbox(img.src, img.alt);
        });
    });
    const instagramItems = document.querySelectorAll('.instagram-item');
    instagramItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img)
                openLightbox(img.src, img.alt);
        });
    });
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal)
                closeLightbox();
        });
    }
    // ----- Booking/Reservation Modal -----
    const reservationModal = document.getElementById('reservation-modal');
    const reservationClose = document.getElementById('reservation-close');
    const openBookingBtns = document.querySelectorAll('.open-booking-btn');
    const reservationModalBody = document.getElementById('reservation-modal-body');
    const originalModalBodyHTML = (_a = reservationModalBody === null || reservationModalBody === void 0 ? void 0 : reservationModalBody.innerHTML) !== null && _a !== void 0 ? _a : '';
    const openReservationModal = () => {
        if (reservationModalBody)
            reservationModalBody.innerHTML = originalModalBodyHTML;
        reAttachFormListener();
        if (reservationModal) {
            reservationModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    const closeReservationModal = () => {
        if (reservationModal)
            reservationModal.classList.remove('active');
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
            if (e.target === reservationModal)
                closeReservationModal();
        });
    }
    const reAttachFormListener = () => {
        const form = document.getElementById('booking-form');
        if (!form)
            return;
        form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            e.preventDefault();
            if (!reservationModalBody)
                return;
            reservationModalBody.innerHTML = `
        <div class="toast-msg" style="padding: 20px 0;">
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <h4>Securing your table...</h4>
          <p>Please wait a moment.</p>
        </div>`;
            const guestName = ((_a = document.getElementById('booking-name')) === null || _a === void 0 ? void 0 : _a.value) || 'Guest';
            const email = ((_b = document.getElementById('booking-email')) === null || _b === void 0 ? void 0 : _b.value) || '';
            const phone = ((_c = document.getElementById('booking-phone')) === null || _c === void 0 ? void 0 : _c.value) || '';
            const guestCount = ((_d = document.getElementById('booking-guests')) === null || _d === void 0 ? void 0 : _d.value) || '2';
            const bookingDate = ((_e = document.getElementById('booking-date')) === null || _e === void 0 ? void 0 : _e.value) || 'today';
            try {
                const response = yield fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: guestName, email, phone, guests: guestCount, date: bookingDate })
                });
                const result = yield response.json();
                // Trigger Google Analytics Event
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'generate_lead', {
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
            }
            catch (error) {
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
        }));
    };
    // Initial attach
    reAttachFormListener();
    // ----- Newsletter Form Submission -----
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const subscribeBtn = newsletterForm.querySelector('button');
            if (!emailInput || !subscribeBtn)
                return;
            const email = emailInput.value;
            subscribeBtn.disabled = true;
            subscribeBtn.innerText = '...';
            try {
                const response = yield fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (response.ok) {
                    emailInput.value = '';
                    subscribeBtn.innerText = 'Subscribed!';
                    subscribeBtn.style.backgroundColor = 'var(--accent-gold)';
                    subscribeBtn.style.color = 'var(--bg-dark)';
                }
                else {
                    subscribeBtn.innerText = 'Error';
                }
            }
            catch (err) {
                subscribeBtn.innerText = 'Error';
            }
            setTimeout(() => {
                subscribeBtn.disabled = false;
                subscribeBtn.innerText = 'Subscribe';
                subscribeBtn.style.backgroundColor = '';
                subscribeBtn.style.color = '';
            }, 3000);
        }));
    }
});
