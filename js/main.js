// main.ts - TypeScript version of the site script
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Helper type for optional query selection
function qs(selector, parent = document) {
    return parent.querySelector(selector);
}
document.addEventListener('DOMContentLoaded', () => {
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
    // ----- Menu Tab Switching -----
    const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
    const menuContents = document.querySelectorAll('.menu-content');
    menuTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            menuTabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.color = '#666';
                b.style.borderBottomColor = 'transparent';
            });
            menuContents.forEach(c => {
                c.style.display = 'none';
                c.classList.remove('active');
            });
            // Add active to clicked
            btn.classList.add('active');
            btn.style.color = '#e0b976';
            btn.style.borderBottomColor = '#e0b976';
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
    let toastTimeout;
    function showToast(message) {
        if (!toast || !toastMsg)
            return;
        toastMsg.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    const pageBookingForm = document.getElementById('page-booking-form');
    if (pageBookingForm) {
        pageBookingForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            e.preventDefault();
            const submitBtn = pageBookingForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Reserving...';
            }
            const name = ((_a = document.getElementById('page-booking-name')) === null || _a === void 0 ? void 0 : _a.value) || '';
            const email = ((_b = document.getElementById('page-booking-email')) === null || _b === void 0 ? void 0 : _b.value) || '';
            const phone = ((_c = document.getElementById('page-booking-phone')) === null || _c === void 0 ? void 0 : _c.value) || '';
            const date = ((_d = document.getElementById('page-booking-date')) === null || _d === void 0 ? void 0 : _d.value) || '';
            const time = ((_e = document.getElementById('page-booking-time')) === null || _e === void 0 ? void 0 : _e.value) || '';
            const maleCount = ((_f = document.getElementById('page-booking-male')) === null || _f === void 0 ? void 0 : _f.value) || '0';
            const femaleCount = ((_g = document.getElementById('page-booking-female')) === null || _g === void 0 ? void 0 : _g.value) || '0';
            const outlet = ((_h = document.getElementById('page-booking-outlet')) === null || _h === void 0 ? void 0 : _h.value) || '';
            let totalGuests = parseInt(maleCount) + parseInt(femaleCount);
            if (isNaN(totalGuests) || totalGuests <= 0)
                totalGuests = 1;
            try {
                const res = yield fetch('/api/bookings', {
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
                }
                else {
                    showToast('Error sending booking request. Please try again.');
                }
            }
            catch (err) {
                showToast('Error sending booking request. Please try again.');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Book Now';
            }
        }));
    }
    const modalBookingForm = document.getElementById('booking-form');
    if (modalBookingForm) {
        modalBookingForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            e.preventDefault();
            const submitBtn = modalBookingForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Reserving...';
            }
            const name = ((_a = document.getElementById('booking-name')) === null || _a === void 0 ? void 0 : _a.value) || '';
            const email = ((_b = document.getElementById('booking-email')) === null || _b === void 0 ? void 0 : _b.value) || '';
            const phone = ((_c = document.getElementById('booking-phone')) === null || _c === void 0 ? void 0 : _c.value) || '';
            const date = ((_d = document.getElementById('booking-date')) === null || _d === void 0 ? void 0 : _d.value) || '';
            const time = ((_e = document.getElementById('booking-time')) === null || _e === void 0 ? void 0 : _e.value) || '';
            const guests = ((_f = document.getElementById('booking-guests')) === null || _f === void 0 ? void 0 : _f.value) || '1';
            const remarks = ((_g = document.getElementById('booking-remarks')) === null || _g === void 0 ? void 0 : _g.value) || '';
            try {
                const res = yield fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, guests, date, time, remarks })
                });
                if (res.ok) {
                    showToast('Table reserved successfully! We will contact you soon.');
                    modalBookingForm.reset();
                    const resModal = document.getElementById('reservation-modal');
                    if (resModal)
                        resModal.style.display = 'none';
                }
                else {
                    showToast('Error sending booking request. Please try again.');
                }
            }
            catch (err) {
                showToast('Error sending booking request. Please try again.');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Book Now';
            }
        }));
    }
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            showToast('Message sent successfully! We will get back to you.');
            contactForm.reset();
        }));
    }
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            if (!emailInput)
                return;
            const email = emailInput.value;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = '...';
            }
            try {
                const res = yield fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (res.ok) {
                    showToast('Successfully subscribed to our newsletter!');
                    newsletterForm.reset();
                }
                else {
                    showToast('Error subscribing to newsletter. Please try again.');
                }
            }
            catch (err) {
                showToast('Error subscribing to newsletter. Please try again.');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Subscribe';
            }
        }));
    }
});
