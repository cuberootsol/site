document.addEventListener('DOMContentLoaded', function() {
    initROICalculator();
    initHamburger();
    initReveal();
    initNavScroll();
    initSmoothScroll();
    initContactForm();
});

function initHamburger() {
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('nav-links');
    if (!btn || !nav) return;

    btn.addEventListener('click', function() {
        btn.classList.toggle('active');
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            btn.classList.remove('active');
            nav.classList.remove('open');
        });
    });
}

function initReveal() {
    var sections = document.querySelectorAll('.reveal');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(function(s) { observer.observe(s); });
}

function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var scrolled = false;
    window.addEventListener('scroll', function() {
        var shouldScroll = window.scrollY > 80;
        if (shouldScroll !== scrolled) {
            scrolled = shouldScroll;
            if (scrolled) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }, { passive: true });
}

function initSmoothScroll() {
    var navEl = document.querySelector('nav');
    var navHeight = navEl ? navEl.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });
    });
}

function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var successEl = document.getElementById('form-success');
    var errorEl = document.getElementById('form-error');
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (successEl) successEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';

        if (submitBtn) {
            submitBtn.classList.add('btn-loading');
            submitBtn.textContent = 'Sending...';
        }

        var formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(function(response) {
            if (response.ok) {
                if (successEl) {
                    successEl.textContent = "Message sent successfully! We'll be in touch within 24 hours.";
                    successEl.style.display = 'block';
                }
                form.reset();
            } else {
                throw new Error('Server responded with ' + response.status);
            }
        }).catch(function() {
            if (errorEl) {
                errorEl.textContent = 'Something went wrong. Please email us directly or try again.';
                errorEl.style.display = 'block';
            }
        }).finally(function() {
            if (submitBtn) {
                submitBtn.classList.remove('btn-loading');
                submitBtn.textContent = originalText;
            }
        });
    });
}

function initROICalculator() {
    var roiForm = document.getElementById('roi-form');
    if (!roiForm) return;

    var resultBox = document.getElementById('roi-result');
    var savingsDisplay = document.getElementById('estimated-savings');
    var breakdownEl = document.getElementById('roi-breakdown');
    var recoverySlider = document.getElementById('recovery-rate');
    var recoveryLabel = document.getElementById('recovery-label');

    if (recoverySlider && recoveryLabel) {
        recoverySlider.addEventListener('input', function() {
            recoveryLabel.textContent = recoverySlider.value + '%';
        });
    }

    roiForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var employees = parseInt(document.getElementById('emp-count').value) || 0;
        var hours = parseFloat(document.getElementById('hours-lost').value) || 0;
        var rate = parseFloat(document.getElementById('hourly-rate').value) || 0;

        var downtimeHrsEl = document.getElementById('downtime-hours');
        var downtimeRateEl = document.getElementById('downtime-rate');
        var softwareSpendEl = document.getElementById('software-spend');

        var downtimeHrs = downtimeHrsEl ? (parseFloat(downtimeHrsEl.value) || 0) : 0;
        var downtimeRate = downtimeRateEl ? (parseFloat(downtimeRateEl.value) || 0) : 0;
        var softwareSpend = softwareSpendEl ? (parseFloat(softwareSpendEl.value) || 0) : 0;
        var recoveryPct = recoverySlider ? (parseInt(recoverySlider.value) || 70) : 70;

        var laborWaste = employees * hours * rate * 52;
        var downtimeCost = downtimeHrs * downtimeRate * 12;
        var softwareSavings = softwareSpend * 12 * 0.25;
        var totalOpportunity = laborWaste + downtimeCost + softwareSavings;
        var annualSavings = Math.round(totalOpportunity * (recoveryPct / 100));

        var fmt = function(n) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 0
            }).format(n);
        };

        savingsDisplay.textContent = fmt(annualSavings);

        var breakdownHtml = '';
        if (laborWaste > 0) {
            breakdownHtml += '<div class="breakdown-row"><span>Productivity recovery</span><span>' + fmt(Math.round(laborWaste * recoveryPct / 100)) + '/yr</span></div>';
        }
        if (downtimeCost > 0) {
            breakdownHtml += '<div class="breakdown-row"><span>Downtime reduction</span><span>' + fmt(Math.round(downtimeCost * recoveryPct / 100)) + '/yr</span></div>';
        }
        if (softwareSavings > 0) {
            breakdownHtml += '<div class="breakdown-row"><span>Software consolidation</span><span>' + fmt(Math.round(softwareSavings * recoveryPct / 100)) + '/yr</span></div>';
        }
        breakdownHtml += '<div class="breakdown-row breakdown-note"><span>Recovery rate applied: ' + recoveryPct + '%</span><span>' + employees + ' employees &times; 52 weeks</span></div>';

        if (breakdownEl) breakdownEl.innerHTML = breakdownHtml;

        resultBox.classList.remove('hidden');
        resultBox.classList.add('fade-in');
    });
}
