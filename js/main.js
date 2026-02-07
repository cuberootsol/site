document.addEventListener('DOMContentLoaded', () => {
    initROICalculator();
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


