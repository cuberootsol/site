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

    window.handleFormSubmit = async function (e) {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');

        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';

        btn.innerText = 'Sending...';
        btn.disabled = true;

        const formData = {
            fullName: form.querySelector('input[name="fullName"]')?.value || '',
            email: form.querySelector('input[name="email"]')?.value || form.querySelector('input[type="email"]')?.value || '',
            company: form.querySelector('input[name="company"]')?.value || '',
            employees: form.querySelector('select[name="employees"]')?.value || '',
            interest: form.querySelector('select[name="interest"]')?.value || '',
            challenges: form.querySelector('textarea[name="challenges"]')?.value || form.querySelector('textarea')?.value || ''
        };

        try {
            const API_ENDPOINT = 'https://api.cuberootsolutions.com/api/leads';
            
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                if (successMsg) {
                    successMsg.style.display = 'block';
                    successMsg.textContent = 'Thank you! A technology consultant will contact you within 24 hours to schedule your free assessment.';
                } else {
                    alert('Thank you! A technology consultant will contact you within 24 hours to schedule your free assessment.');
                }
                form.reset();
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID',
                        'value': formData.interest.includes('Enterprise') ? 3000 : (formData.interest.includes('Professional') ? 2250 : 1500),
                        'currency': 'USD'
                    });
                }
            } else {
                throw new Error('Server returned error status');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'There was an error submitting your request. Please email us directly at contact@cuberootsolutions.com';
            } else {
                alert('There was an error. Please email us at contact@cuberootsolutions.com');
            }
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
});
