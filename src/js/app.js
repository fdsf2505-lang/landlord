// Intersection Observer для анимаций
const observerOptions = {
    threshold: 0.25,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Отладочный лог
            console.log(`Элемент ${entry.target.className} стал видимым`);
        }
    });
}, observerOptions);

// Авто-активация для больших экранов
function handleRevealElements() {
    const revealElements = document.querySelectorAll('.reveal');
    
    // Отладочный лог
    console.log(`Найдено ${revealElements.length} элементов с классом .reveal`);
    
    if (window.innerWidth >= 1024) {
        revealElements.forEach(element => {
            element.classList.add('active');
            console.log('Авто-активация для:', element);
        });
    } else {
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// График рыночных цен
function initMarketChart() {
    const ctx = document.getElementById('marketTrends');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            datasets: [{
                label: 'Средняя цена аренды ($)',
                data: [500, 520, 540, 580, 600, 620],
                borderColor: '#2563eb',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Динамика цен на аренду в Бишкеке'
                }
            }
        }
    });
}

// Валидация форм
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Добавить реальную валидацию позже
            console.log('Форма отправлена:', new FormData(form));
        });
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    handleRevealElements();
    initMarketChart();
    initFormValidation();
    
    // Обработка resize для адаптивной активации
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleRevealElements, 250);
    });
});