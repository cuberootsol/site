document.addEventListener('DOMContentLoaded', () => {
    initROICalculator();
    initHamburger();
    initReveal();
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

/* --- ROI Calculator --- */
function initROICalculator() {
    const roiForm = document.getElementById('roi-form');
    if (!roiForm) return;

    const resultBox = document.getElementById('roi-result');
    const savingsDisplay = document.getElementById('estimated-savings');
    const breakdownEl = document.getElementById('roi-breakdown');
    const recoverySlider = document.getElementById('recovery-rate');
    const recoveryLabel = document.getElementById('recovery-label');

    // Sync recovery slider label
    if (recoverySlider && recoveryLabel) {
        recoverySlider.addEventListener('input', () => {
            recoveryLabel.textContent = recoverySlider.value + '%';
        });
    }

    roiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const employees = parseInt(document.getElementById('emp-count').value) || 0;
        const hours = parseFloat(document.getElementById('hours-lost').value) || 0;
        const rate = parseFloat(document.getElementById('hourly-rate').value) || 0;

        // Optional fields
        const downtimeHrs = parseFloat(document.getElementById('downtime-hours')?.value) || 0;
        const downtimeRate = parseFloat(document.getElementById('downtime-rate')?.value) || 0;
        const softwareSpend = parseFloat(document.getElementById('software-spend')?.value) || 0;
        const recoveryPct = parseInt(recoverySlider?.value) || 70;

        // Labor waste: 52 weeks/year
        const laborWaste = employees * hours * rate * 52;

        // Downtime cost: hours * rate * 12 months
        const downtimeCost = downtimeHrs * downtimeRate * 12;

        // Software consolidation: 25% typical savings
        const softwareSavings = softwareSpend * 12 * 0.25;

        // Total opportunity
        const totalOpportunity = laborWaste + downtimeCost + softwareSavings;

        // Apply realistic recovery rate
        const annualSavings = Math.round(totalOpportunity * (recoveryPct / 100));

        const fmt = (n) => new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', maximumFractionDigits: 0
        }).format(n);

        savingsDisplay.textContent = fmt(annualSavings);

        // Build breakdown
        let breakdownHtml = '';
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
