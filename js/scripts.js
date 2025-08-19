// Oxygen PG Main JavaScript File

$(document).ready(function() {
    // Initialize all components
    initializeNavigation();
    initializeGallery();
    initializeForms();
    initializeAnimations();
    initializeCarousels();
    initializeSmoothScroll();
    initializeTooltips();
    
    // Set minimum date for booking forms
    setMinimumDate();
    
    // Auto-hide flash messages
    autoHideFlashMessages();
});

// Navigation functionality
function initializeNavigation() {
    // Add active class to current page navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.navbar-nav .nav-link').each(function() {
        const href = $(this).attr('href');
        if (href === currentPage) {
            $(this).addClass('active');
        }
    });
    
    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            $('.navbar').addClass('scrolled').css({
                'background-color': 'rgba(255, 255, 255, 0.95)',
                'backdrop-filter': 'blur(10px)',
                'box-shadow': '0 2px 20px rgba(0, 0, 0, 0.1)'
            });
        } else {
            $('.navbar').removeClass('scrolled').css({
                'background-color': 'rgba(255, 255, 255, 0.9)',
                'backdrop-filter': 'blur(5px)',
                'box-shadow': 'none'
            });
        }
    });
    
    // Mobile menu close on link click
    $('.navbar-nav .nav-link').click(function() {
        $('.navbar-collapse').collapse('hide');
    });
}

// Gallery functionality
function initializeGallery() {
    // Gallery filtering
    $('.gallery-filters button').click(function() {
        const filter = $(this).data('filter');
        
        // Update active button
        $('.gallery-filters button').removeClass('active');
        $(this).addClass('active');
        
        // Filter gallery items
        if (filter === 'all') {
            $('.gallery-item').fadeIn(300);
        } else {
            $('.gallery-item').hide();
            $(`.gallery-item[data-category="${filter}"]`).fadeIn(300);
        }
    });
    
    // Gallery modal functionality
    $('.gallery-card img').click(function() {
        const src = $(this).attr('src');
        const title = $(this).data('title');
        const description = $(this).data('description');
        
        $('#modalImage').attr('src', src);
        $('#imageModalLabel').text(title);
        $('#modalDescription').text(description);
    });
    
    // Gallery hover effects
    $('.gallery-card').hover(
        function() {
            $(this).find('img').css('transform', 'scale(1.1)');
            $(this).find('.gallery-overlay').css('opacity', '1');
        },
        function() {
            $(this).find('img').css('transform', 'scale(1)');
            $(this).find('.gallery-overlay').css('opacity', '0');
        }
    );
}

// Form functionality
function initializeForms() {
    // Form validation
    $('form').each(function() {
        $(this).on('submit', function(e) {
            let isValid = true;
            
            // Check required fields
            $(this).find('[required]').each(function() {
                if ($(this).val().trim() === '') {
                    isValid = false;
                    $(this).addClass('is-invalid');
                    showError($(this), 'This field is required');
                } else {
                    $(this).removeClass('is-invalid');
                    removeError($(this));
                }
            });
            
            // Email validation
            $(this).find('input[type="email"]').each(function() {
                const email = $(this).val();
                if (email && !isValidEmail(email)) {
                    isValid = false;
                    $(this).addClass('is-invalid');
                    showError($(this), 'Please enter a valid email address');
                }
            });
            
            // Phone validation
            $(this).find('input[type="tel"]').each(function() {
                const phone = $(this).val();
                if (phone && !isValidPhone(phone)) {
                    isValid = false;
                    $(this).addClass('is-invalid');
                    showError($(this), 'Please enter a valid phone number');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $('.is-invalid').first().offset().top - 100
                }, 500);
            }
        });
    });
    
    // Real-time validation
    $('input, textarea, select').on('blur', function() {
        validateField($(this));
    });
    
    // Gender-based property filtering
    $('select[name="gender"]').change(function() {
        const gender = $(this).val();
        const propertySelect = $('select[name="property"]');
        const options = propertySelect.find('option');
        
        options.hide();
        options.first().show(); // Show default option
        
        if (gender === 'Male') {
            options.filter(':contains("Gents")').show();
        } else if (gender === 'Female') {
            options.filter(':contains("Ladies")').show();
        } else {
            options.show();
        }
        
        propertySelect.val(''); // Reset selection
    });
    
    // Auto-format phone numbers
    $('input[type="tel"]').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 0) {
            if (value.startsWith('91')) {
                value = '+' + value;
            } else if (value.length === 10) {
                value = '+91' + value;
            }
        }
        $(this).val(value);
    });
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation classes
                if (element.classList.contains('animate-on-scroll')) {
                    element.classList.add('fade-in-up');
                }
                
                // Counter animation for statistics
                if (element.classList.contains('stat-item')) {
                    animateCounter(element);
                }
                
                // Stagger animations for card grids
                if (element.classList.contains('card-grid')) {
                    animateCardGrid(element);
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements
    $('.animate-on-scroll, .stat-item, .card-grid').each(function() {
        observer.observe(this);
    });
    
    // Parallax effect for hero section
    $(window).scroll(function() {
        const scroll = $(window).scrollTop();
        const heroHeight = $('.hero-section').height();
        
        // if (scroll < heroHeight) {
        //     $('.hero-section').css({
        //         'transform': `translateY(${scroll * 0.5}px)`
        //     });
        // }
    });
}

// Carousel functionality
function initializeCarousels() {
    // Auto-play carousels
    $('.carousel').each(function() {
        $(this).carousel({
            interval: 5000,
            wrap: true,
            keyboard: true
        });
    });
    
    // Pause on hover
    $('.carousel').hover(
        function() { $(this).carousel('pause'); },
        function() { $(this).carousel('cycle'); }
    );
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    // Smooth scroll for anchor links
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'easeInOutCubic');
        }
    });
    
    // Back to top button
    $(window).scroll(function() {
        if ($(window).scrollTop() > 500) {
            if (!$('.back-to-top').length) {
                $('body').append(`
                    <button class="back-to-top btn btn-primary">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                `);
            }
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    });
    
    // Back to top click
    $(document).on('click', '.back-to-top', function() {
        $('html, body').animate({scrollTop: 0}, 800);
    });
}

// Tooltip initialization
function initializeTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Custom tooltips for form help
    $('.form-control, .form-select').each(function() {
        const help = $(this).data('help');
        if (help) {
            $(this).attr('title', help);
            $(this).tooltip();
        }
    });
}

// Utility functions
function setMinimumDate() {
    const today = new Date().toISOString().split('T')[0];
    $('input[type="date"]').attr('min', today);
}

function autoHideFlashMessages() {
    setTimeout(function() {
        $('.alert').fadeOut(500);
    }, 5000);
}

function validateField(field) {
    const value = field.val().trim();
    const type = field.attr('type');
    const required = field.prop('required');
    
    field.removeClass('is-invalid is-valid');
    removeError(field);
    
    if (required && value === '') {
        field.addClass('is-invalid');
        showError(field, 'This field is required');
        return false;
    }
    
    if (value !== '') {
        if (type === 'email' && !isValidEmail(value)) {
            field.addClass('is-invalid');
            showError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (type === 'tel' && !isValidPhone(value)) {
            field.addClass('is-invalid');
            showError(field, 'Please enter a valid phone number');
            return false;
        }
        
        field.addClass('is-valid');
    }
    
    return true;
}

function showError(field, message) {
    removeError(field);
    field.after(`<div class="invalid-feedback">${message}</div>`);
}

function removeError(field) {
    field.next('.invalid-feedback').remove();
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPhone(phone) {
    const regex = /^(\+91|91)?[6-9]\d{9}$/;
    return regex.test(phone.replace(/\s+/g, ''));
}

function animateCounter(element) {
    const counter = $(element).find('h2, h3');
    const target = parseInt(counter.text().replace(/[^\d]/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        const originalText = counter.text();
        
        if (originalText.includes('%')) {
            displayValue += '%';
        } else if (originalText.includes('+')) {
            displayValue += '+';
        }
        
        counter.text(displayValue);
    }, 16);
}

function animateCardGrid(element) {
    const cards = $(element).find('.card, .gallery-item, .team-card');
    
    cards.each(function(index) {
        const card = $(this);
        setTimeout(function() {
            card.addClass('fade-in-up');
        }, index * 100);
    });
}

// Contact page specific functions
function scheduleVisit() {
    // Open a modal or redirect to booking form
    const modal = `
        <div class="modal fade" id="scheduleModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Schedule a Visit</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="scheduleForm">
                            <div class="mb-3">
                                <label class="form-label">Preferred Date</label>
                                <input type="date" class="form-control" name="visit_date" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Preferred Time</label>
                                <select class="form-select" name="visit_time" required>
                                    <option value="">Select Time</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="2:00 PM">2:00 PM</option>
                                    <option value="4:00 PM">4:00 PM</option>
                                    <option value="6:00 PM">6:00 PM</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Location</label>
                                <select class="form-select" name="location" required>
                                    <option value="">Select Location</option>
                                    <option value="Marathahalli Gents">Marathahalli Gents</option>
                                    <option value="Marathahalli Ladies">Marathahalli Ladies</option>
                                    <option value="Bellandur Ladies">Bellandur Ladies</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Your Name</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone Number</label>
                                <input type="tel" class="form-control" name="phone" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitScheduleForm()">Schedule Visit</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    if (!$('#scheduleModal').length) {
        $('body').append(modal);
    }
    
    $('#scheduleModal').modal('show');
    setMinimumDate();
}

function submitScheduleForm() {
    const form = $('#scheduleForm');
    if (form[0].checkValidity()) {
        // Here you would typically send the data to the server
        alert('Visit scheduled successfully! We will contact you to confirm.');
        $('#scheduleModal').modal('hide');
    } else {
        form[0].reportValidity();
    }
}

// Gallery image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Search functionality (if needed)
function initializeSearch() {
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.searchable-item').each(function() {
            const text = $(this).text().toLowerCase();
            if (text.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
}

// Device detection for responsive features
function getDeviceType() {
    const width = $(window).width();
    if (width < 576) return 'mobile';
    if (width < 768) return 'tablet';
    if (width < 992) return 'desktop-small';
    return 'desktop';
}

// Performance optimization
function optimizeImages() {
    // Convert images to WebP if supported
    const supportsWebP = (function() {
        const elem = document.createElement('canvas');
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();
    
    if (supportsWebP) {
        $('img').each(function() {
            const src = $(this).attr('src');
            if (src && !src.includes('.webp')) {
                // You would implement server-side WebP conversion
                // $(this).attr('src', src.replace(/\.(jpg|jpeg|png)$/, '.webp'));
            }
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send error reports to your server here
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Export functions for use in other scripts
window.OxygenPG = {
    scheduleVisit: scheduleVisit,
    validateField: validateField,
    getDeviceType: getDeviceType
};
