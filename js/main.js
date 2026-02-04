document.addEventListener('DOMContentLoaded', () => {
    initROICalculator();
    initCaseStudyCarousel();
});

/* --- ROI Estimator --- */
function initROICalculator() {
    const roiForm = document.getElementById('roi-form');
    const resultBox = document.getElementById('roi-result');
    const savingsDisplay = document.getElementById('estimated-savings');

    if (!roiForm) return;

    roiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const employees = parseInt(document.getElementById('emp-count').value) || 0;
        const hours = parseInt(document.getElementById('hours-lost').value) || 0;
        const rate = parseInt(document.getElementById('hourly-rate').value) || 0;

        // Monthly savings
        const monthlySavings = employees * hours * rate * 4; // 4 weeks

        // Annual savings
        const annualSavings = monthlySavings * 12;

        const formattedSavings = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(annualSavings);

        savingsDisplay.textContent = formattedSavings;
        resultBox.classList.remove('hidden');
        resultBox.classList.add('fade-in');
    });
}

/* --- Case Study Carousel --- */
function initCaseStudyCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');

    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        // Handle wrap-around
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    }

    // Auto-advance
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 6000);
}
