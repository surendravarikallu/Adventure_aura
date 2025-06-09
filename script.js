// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => window.scrollY > 100 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled'));

    document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }));

    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.trim() === 'Book Now') btn.addEventListener('click', e => {
            e.preventDefault();
            const card = btn.closest('.card');
            showModal('packageModal', card.querySelector('.card-title').textContent, card.querySelector('.badge').textContent);
        });
    });

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.card-title').textContent;
            const desc = card.querySelector('.card-text').textContent;
            const icon = card.querySelector('.service-icon').innerHTML;
            showServiceModal(title, desc, icon);
        });
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 30px rgba(31, 41, 55, 0.15)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(31, 41, 55, 0.1)';
        });
    });

    ['newsletterForm', 'contactForm'].forEach(formId => {
        const form = document.getElementById(formId);
        if (form) form.addEventListener('submit', e => {
            e.preventDefault();
            alert(formId === 'newsletterForm' ? 
                `Thank you for subscribing with ${e.target.querySelector('input[type="email"]').value}!` : 
                'Thank you for your message! We will get back to you soon.');
            e.target.reset();
        });
    });

    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) new bootstrap.Collapse(navbarCollapse).hide();
    }));

    const statsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.stat-item h3').forEach(counter => {
                const target = parseInt(counter.textContent.replace('+', ''));
                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + '+';
                        clearInterval(timer);
                    } else counter.textContent = Math.floor(current) + '+';
                }, 20);
            });
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.journey-stats');
    if (statsSection) statsObserver.observe(statsSection);

    document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => 
        img.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Available'));

    console.log('Adventure Aura website loaded successfully!');
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth reveal animations
function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('visible');
        }
    });
}

// Debounced scroll event
window.addEventListener('scroll', debounce(revealOnScroll, 10));

// Initialize reveal on load
document.addEventListener('DOMContentLoaded', revealOnScroll);

function animateCounters() {
    document.querySelectorAll('.stat-item h3').forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

const createModal = (id, content) => {
    document.body.insertAdjacentHTML('beforeend', `<div class="modal fade" id="${id}" tabindex="-1">${content}</div>`);
    new bootstrap.Modal(document.getElementById(id)).show();
    document.getElementById(id).addEventListener('hidden.bs.modal', function() { this.remove(); });
};

const showModal = (id, title, price) => createModal(id, `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Book ${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-4"><span class="badge bg-primary fs-5">${price}</span></div>
                <form id="bookingForm" class="mt-4">
                    <div class="mb-3">
                        <label class="form-label">Number of Travelers</label>
                        <input type="number" class="form-control" min="1" max="8" value="1" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Preferred Date</label>
                        <input type="date" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Special Requirements</label>
                        <textarea class="form-control" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="submitBooking()">Confirm Booking</button>
            </div>
        </div>
    </div>`);

const showServiceModal = (title, description, icon) => createModal('serviceModal', `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-4"><div class="service-icon mx-auto">${icon}</div></div>
                <p class="mb-4">${description}</p>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center d-flex flex-column justify-content-between">
                                <div>
                                    <h6 class="mb-2">Standard Package</h6>
                                    <p class="text-muted mb-3">Basic service features</p>
                                </div>
                                <button class="btn btn-outline-primary rounded-pill" onclick="selectService('standard', '${title}')">Select</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center d-flex flex-column justify-content-between">
                                <div>
                                    <h6 class="mb-2">Premium Package</h6>
                                    <p class="text-muted mb-3">Enhanced features & priority support</p>
                                </div>
                                <button class="btn btn-primary rounded-pill" onclick="selectService('premium', '${title}')">Select</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`);

const submitBooking = () => {
    const form = document.getElementById('bookingForm');
    if (form.checkValidity()) {
        alert('Booking submitted successfully! We will contact you shortly with confirmation details.');
        bootstrap.Modal.getInstance(document.getElementById('packageModal')).hide();
    } else form.reportValidity();
};

const selectService = (package, service) => createModal('serviceFormModal', `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${package} Package - ${service}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="serviceBookingForm">
                    <div class="mb-3">
                        <label class="form-label">Your Name</label>
                        <input type="text" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Preferred Date</label>
                        <input type="date" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Additional Requirements</label>
                        <textarea class="form-control" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="submitServiceBooking('${package}', '${service}')">Submit Request</button>
            </div>
        </div>
    </div>`);

const submitServiceBooking = (package, service) => {
    const form = document.getElementById('serviceBookingForm');
    if (form.checkValidity()) {
        alert(`Thank you for selecting the ${package} package for ${service}. Our team will contact you shortly.`);
        bootstrap.Modal.getInstance(document.getElementById('serviceFormModal')).hide();
    } else form.reportValidity();
};
