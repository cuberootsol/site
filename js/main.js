document.addEventListener('DOMContentLoaded', function() {
    initROICalculator();
    initHamburger();
    initReveal();
    initNavScroll();
    initSmoothScroll();
    initContactForm();
    initHeroCanvas();
    initCounters();
    initStatusTicker();
});

function initHamburger() {
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('nav-links');
    if (!btn || !nav) return;
    btn.addEventListener('click', function() { btn.classList.toggle('active'); nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function(link) { link.addEventListener('click', function() { btn.classList.remove('active'); nav.classList.remove('open'); }); });
}

function initReveal() {
    var sections = document.querySelectorAll('.reveal');
    if (!sections.length) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1 });
    sections.forEach(function(s) { observer.observe(s); });
}

function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var scrolled = false;
    window.addEventListener('scroll', function() {
        var shouldScroll = window.scrollY > 80;
        if (shouldScroll !== scrolled) { scrolled = shouldScroll; nav.classList.toggle('scrolled', scrolled); }
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
            window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20, behavior: 'smooth' });
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
        if (submitBtn) { submitBtn.classList.add('btn-loading'); submitBtn.textContent = 'Sending...'; }

        fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function(r) { if (r.ok) { if (successEl) successEl.style.display = 'block'; form.reset(); } else { throw new Error('fail'); } })
        .catch(function() { if (errorEl) errorEl.style.display = 'block'; })
        .finally(function() { if (submitBtn) { submitBtn.classList.remove('btn-loading'); submitBtn.textContent = originalText; } });
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
        recoverySlider.addEventListener('input', function() { recoveryLabel.textContent = recoverySlider.value + '%'; });
    }

    roiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var employees = parseInt(document.getElementById('emp-count').value) || 0;
        var hours = parseFloat(document.getElementById('hours-lost').value) || 0;
        var rate = parseFloat(document.getElementById('hourly-rate').value) || 0;
        var downtimeHrs = parseFloat((document.getElementById('downtime-hours') || {}).value) || 0;
        var downtimeRate = parseFloat((document.getElementById('downtime-rate') || {}).value) || 0;
        var softwareSpend = parseFloat((document.getElementById('software-spend') || {}).value) || 0;
        var recoveryPct = recoverySlider ? (parseInt(recoverySlider.value) || 70) : 70;

        var laborWaste = employees * hours * rate * 52;
        var downtimeCost = downtimeHrs * downtimeRate * 12;
        var softwareSavings = softwareSpend * 12 * 0.25;
        var annualSavings = Math.round((laborWaste + downtimeCost + softwareSavings) * (recoveryPct / 100));

        var fmt = function(n) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); };
        savingsDisplay.textContent = fmt(annualSavings);

        var html = '';
        if (laborWaste > 0) html += '<div class="breakdown-row"><span>Productivity recovery</span><span>' + fmt(Math.round(laborWaste * recoveryPct / 100)) + '/yr</span></div>';
        if (downtimeCost > 0) html += '<div class="breakdown-row"><span>Downtime reduction</span><span>' + fmt(Math.round(downtimeCost * recoveryPct / 100)) + '/yr</span></div>';
        if (softwareSavings > 0) html += '<div class="breakdown-row"><span>Software consolidation</span><span>' + fmt(Math.round(softwareSavings * recoveryPct / 100)) + '/yr</span></div>';
        html += '<div class="breakdown-row breakdown-note"><span>Recovery rate: ' + recoveryPct + '%</span><span>' + employees + ' employees x 52 weeks</span></div>';
        if (breakdownEl) breakdownEl.innerHTML = html;

        resultBox.classList.remove('hidden');
        resultBox.classList.add('fade-in');
    });
}

function initHeroCanvas() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var width, height, points, maxDist;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        maxDist = Math.min(width, height) * 0.12;
        points = [];
        var count = Math.floor((width * height) / 14000);
        for (var i = 0; i < count; i++) {
            points.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.5 + 0.5 });
        }
    }
    resize();
    window.addEventListener('resize', resize);

    var isVisible = true;
    new IntersectionObserver(function(entries) { isVisible = entries[0].isIntersecting; }).observe(canvas);

    function draw() {
        if (!isVisible) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.35)'; ctx.fill();
            for (var j = i + 1; j < points.length; j++) {
                var q = points[j], dx = p.x - q.x, dy = p.y - q.y, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = 'rgba(59, 130, 246, ' + (0.06 * (1 - dist / maxDist)) + ')';
                    ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

function initCounters() {
    var stats = document.querySelectorAll('.stat-number');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(function(s) { observer.observe(s); });
}

function animateValue(el, start, end, duration) {
    var startTs = null;
    function step(ts) {
        if (!startTs) startTs = ts;
        var progress = Math.min((ts - startTs) / duration, 1);
        var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = new Intl.NumberFormat('en-US').format(Math.floor(ease * (end - start) + start));
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function initStatusTicker() {
    var tickerContent = document.getElementById('ticker-content');
    if (!tickerContent) return;

    var metrics = [
        { value: '99.97%', label: 'Client Infrastructure Uptime (Rolling 90-day)' },
        { value: '37%', label: 'Average Operational Cost Reduction After Engagement' },
        { value: '< 4 hrs', label: 'Mean Time to Resolution on Critical Issues' },
        { value: '12 hrs/wk', label: 'Average Time Reclaimed per Client Employee' },
        { value: '$0', label: 'Unplanned Downtime Costs (Last Quarter)' },
        { value: '100%', label: 'Client Retention Rate' },
        { value: '48 hrs', label: 'Emergency Response Guarantee' },
        { value: '3.2x', label: 'Average ROI Within First 12 Months' },
        { value: '< 24 hrs', label: 'Standard Response SLA' },
        { value: '0', label: 'Long-Term Contracts Required' }
    ];

    var baseHtml = metrics.map(function(m) {
        return '<span class="ticker-item"><span class="metric-value">' + m.value + '</span><span class="metric-label">' + m.label + '</span></span>';
    }).join('');

    tickerContent.innerHTML = baseHtml + baseHtml + baseHtml + baseHtml;
}
