// BoxCraft Industries Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('nav__menu--open');
        navToggle.classList.toggle('nav__toggle--open');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('nav__menu--open');
            navToggle.classList.remove('nav__toggle--open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            navMenu.classList.remove('nav__menu--open');
            navToggle.classList.remove('nav__toggle--open');
        }
    });

    // Fixed Smooth Scrolling for Navigation Links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Background Change on Scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#515151';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.backgroundColor = '#515151';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Fixed Animated Counter Function
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            
            // Format the display value correctly
            if (end >= 1000) {
                element.textContent = currentValue.toLocaleString() + '+';
            } else {
                element.textContent = currentValue;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.classList.add('animated');
            }
        };
        
        window.requestAnimationFrame(step);
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Animate statistics counters with correct values
                if (target.classList.contains('stat__number') && !target.classList.contains('animated')) {
                    const targetValue = parseInt(target.dataset.target);
                    animateCounter(target, 0, targetValue, 2000);
                }
                
                // Add fade-in animation to cards
                if (target.classList.contains('product-card') || 
                    target.classList.contains('service-card') || 
                    target.classList.contains('feature-card') ||
                    target.classList.contains('testimonial-card')) {
                    target.style.opacity = '0';
                    target.style.transform = 'translateY(30px)';
                    target.style.transition = 'all 0.6s ease-out';
                    
                    setTimeout(() => {
                        target.style.opacity = '1';
                        target.style.transform = 'translateY(0)';
                    }, 100);
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const statsNumbers = document.querySelectorAll('.stat__number');
    const cards = document.querySelectorAll('.product-card, .service-card, .feature-card, .testimonial-card');
    
    statsNumbers.forEach(stat => observer.observe(stat));
    cards.forEach(card => observer.observe(card));

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            // Simulate API call delay
            setTimeout(() => {
                showNotification('Thank you for your message! We will contact you soon.', 'success');
                contactForm.reset();
                
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }, 1500);
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system with new color scheme
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease-out;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        // Set background color based on type using new color scheme
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#C4A373'; // Warm beige
                notification.style.color = '#515151'; // Dark charcoal text
                break;
            case 'error':
                notification.style.backgroundColor = '#5D4E37'; // Dark brown
                notification.style.color = '#FFFFFF'; // White text
                break;
            case 'warning':
                notification.style.backgroundColor = '#A8A8A8'; // Medium gray
                notification.style.color = '#515151'; // Dark charcoal text
                break;
            default:
                notification.style.backgroundColor = '#BDBDBD'; // Light gray
                notification.style.color = '#515151'; // Dark charcoal text
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }



    // Add loading animation for page load
    window.addEventListener('load', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(30px)';
            hero.style.transition = 'all 0.8s ease-out';
            
            setTimeout(() => {
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 100);
        }
    });

    // Performance optimization: Debounce scroll events
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

    // Apply debouncing to scroll handler with subtle parallax
    window.addEventListener('scroll', debounce(function() {
        const scrolled = window.pageYOffset;
        
        // Add subtle parallax effect to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        }
    }, 10));

    // Initialize AOS-like animations for better UX
    const animateOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add animation class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0.95';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        animateOnScroll.observe(section);
    });

    // CSS for animate-in class and enhanced styling
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Enhanced hover effects for new color scheme */
        .product-card:hover .product-card__header {
            background: #B8956A !important;
            transition: all 0.3s ease;
        }
        
        .service-card:hover {
            background: #F0F0F0 !important;
        }
        
        .feature-card:hover h3 {
            color: #5D4E37 !important;
            transition: all 0.3s ease;
        }
        
        .gallery__item:hover .gallery__placeholder {
            color: #FFFFFF !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        /* Button hover effects */
        .btn--primary:hover {
            background: #B8956A !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(196, 163, 115, 0.3);
        }
        
        .btn--outline:hover {
            background: #5D4E37 !important;
            color: #C4A373 !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(93, 78, 55, 0.3);
        }
        
        /* Mobile menu improvements */
        @media (max-width: 768px) {
            .nav__toggle {
                display: flex !important;
            }
            
            .nav__menu {
                display: flex !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Add dynamic color transitions for interactive elements
    const interactiveElements = document.querySelectorAll('.nav__link, .btn, .product-card, .service-card, .feature-card, .testimonial-card, .gallery__item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Add scroll-to-top functionality with new color scheme
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '↑';
    scrollTopButton.setAttribute('aria-label', 'Scroll to top');
    scrollTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #C4A373;
        color: #515151;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(196, 163, 115, 0.3);
    `;
    
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollTopButton.addEventListener('mouseenter', function() {
        this.style.background = '#B8956A';
        this.style.transform = 'translateY(0) scale(1.1)';
    });
    
    scrollTopButton.addEventListener('mouseleave', function() {
        this.style.background = '#C4A373';
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    document.body.appendChild(scrollTopButton);
    
    // Show/hide scroll-to-top button
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.transform = 'translateY(0)';
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.transform = 'translateY(100px)';
        }
    }, 10));

    // Sidebar Toggle Functionality
    const sidebar = document.getElementById('sidebar');
    const moreBtn = document.getElementById('more-btn');

    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Service details for the popup
    const serviceDetails = {
        design: {
            title: "Custom Design & Manufacturing",
            description: "Tailored packaging solutions designed specifically for your products.",
            details: "We work closely with your team to create packaging that enhances your product's appeal and protects it throughout the supply chain. From concept to final production, we ensure every design is unique to your brand."
        },
        prototyping: {
            title: "Rapid Prototyping",
            description: "Quick sample production to test and refine your packaging design.",
            details: "Our rapid prototyping service allows you to see and touch the packaging design before committing to full production. This helps to refine the design, making sure it meets all your product requirements."
        },
        production: {
            title: "Bulk Production",
            description: "High-volume manufacturing capabilities with consistent quality.",
            details: "We have state-of-the-art manufacturing facilities capable of handling large orders without compromising on quality. Our process ensures consistent, high-quality packaging solutions at scale."
        },
        testing: {
            title: "Quality Testing",
            description: "Comprehensive testing to ensure packaging meets industry standards.",
            details: "Our quality testing ensures that all packaging is durable, functional, and meets regulatory and safety standards. This includes stress tests, material durability checks, and more."
        },
        sustainability: {
            title: "Sustainable Solutions",
            description: "Eco-friendly packaging options using recycled and biodegradable materials.",
            details: "We prioritize sustainability in our packaging solutions. From biodegradable materials to fully recyclable designs, we offer options that minimize environmental impact while maintaining quality and performance."
        },
        logistics: {
            title: "Logistics Support",
            description: "Complete supply chain support from design to delivery.",
            details: "We provide end-to-end logistics support, including packaging, warehousing, and transportation management. Our logistics team ensures your products reach their destination on time and intact."
        }
    };

    // Open the popup when a service card is clicked
    const serviceCards = document.querySelectorAll('.service-card');
    const popup = document.getElementById('servicePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDescription = document.getElementById('popupDescription');
    const popupDetails = document.getElementById('popupDetails');
    const closePopup = document.querySelector('.popup-close');

    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceKey = card.getAttribute('data-service');
            const serviceInfo = serviceDetails[serviceKey];

            popupTitle.textContent = serviceInfo.title;
            popupDescription.textContent = serviceInfo.description;
            popupDetails.textContent = serviceInfo.details;

            popup.style.display = 'block';
        });
    });

    // Close the popup
    closePopup.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Close the popup when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});

// WhatsApp Icon Display on Scroll
    window.onscroll = function() { showWhatsappButton() };

    function showWhatsappButton() {
        var scrollPosition = window.scrollY;
        var whatsappButton = document.getElementById("whatsapp-icon");

        if (scrollPosition > 100) { // Change 200 to whatever scroll position you want
            whatsappButton.style.display = "block"; // Show button after scrolling
        } else {
            whatsappButton.style.display = "none"; // Hide button when on top
        }
    }
 

// Testimonial Slider Functionality

const slider = document.getElementById('testimonial-slider');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let index = 0;
const totalCards = slider.children.length;

// Move to next card
function moveNext() {
  index = (index + 1) % totalCards;
  updateSlider();
}

// Move to previous card
function movePrev() {
  index = (index - 1 + totalCards) % totalCards;
  updateSlider();
}

// Update the slider position
function updateSlider() {
  slider.style.transform = `translateX(-${index * 100}%)`;
}

// Button Event Listeners
nextBtn.addEventListener('click', moveNext);
prevBtn.addEventListener('click', movePrev);

// Auto-slide every 5 seconds
setInterval(moveNext, 5000);


// Sidebar Toggle Functionality moved to main DOMContentLoaded

// Contact Form Submission to WhatsApp
 document.getElementById("contactForm").addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent form from submitting

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        const fullMessage = `Bhagawati PaperBox Industries:%0A
            Full Name: ${name}%0A
            Email: ${email}%0A
            Phone: ${phone}%0A
            Message: ${message}`;

        const whatsappNumber = "+919409440195"; // Replace with your WhatsApp number (no "+" or spaces)

        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${fullMessage}`;

        window.open(whatsappURL, "_blank"); // Open WhatsApp with message
    });