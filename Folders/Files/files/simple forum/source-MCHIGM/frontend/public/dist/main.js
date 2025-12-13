document.addEventListener('DOMContentLoaded', () => {
    console.log('MCHIGM Platform initialized');
    initializeApp();
});
function initializeApp() {
    console.log('Initializing MCHIGM Community Platform...');
    setupEventListeners();
    loadInitialData();
}
function setupEventListeners() {
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
            console.log('发布需求按钮被点击');
            alert('需求发布功能正在开发中...');
        });
    }
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', () => {
            console.log('提供资源按钮被点击');
            alert('资源提供功能正在开发中...');
        });
    }
}
function loadInitialData() {
    console.log('Loading initial data...');
    animateStats();
}
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
        const target = parseInt(stat.innerText) || 0;
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target.toString();
                clearInterval(timer);
            }
            else {
                stat.innerText = Math.floor(current).toString();
            }
        }, 30);
    });
}
export { initializeApp };
//# sourceMappingURL=main.js.map