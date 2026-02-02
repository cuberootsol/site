/* Main JavaScript */
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    window.toggleMenu = function () {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'white';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        }
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Contact Form Handling
    window.openContactForm = function (planName) {
        const select = document.getElementById('interest');
        if (select) {
            select.value = planName;
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    }

    window.handleFormSubmit = function (e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = 'Sending...';
        btn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            alert('Thank you! A technology consultant will contact you shortly to schedule your assessment.');
            e.target.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    }
});
