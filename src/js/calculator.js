// Улучшенный калькулятор ROI
function calculateROI() {
    const propertyCount = parseInt(document.getElementById('propertyCount').value) || 0;
    const averageRent = parseInt(document.getElementById('averageRent').value) || 0;
    
    if (propertyCount && averageRent) {
        // 1. Оптимизация цены (6-8% в зависимости от цены)
        const priceOptimization = averageRent < 500 ? 0.08 : 0.06;
        const priceGain = averageRent * priceOptimization;
        
        // 2. Снижение простоев (в среднем 2 недели в год = 4% годовых)
        const vacancyReduction = (averageRent * 0.04) / 12;
        
        // 3. Экономия времени (2 часа в месяц на объект = $20 в час)
        const timeValue = 40;
        
        // Общая выгода с учетом всех факторов и количества объектов
        const totalMonthlyGain = (priceGain + vacancyReduction + timeValue) * propertyCount;
        
        // Стоимость подписки зависит от количества объектов
        const subscriptionCost = propertyCount <= 1 ? 15 : (propertyCount <= 5 ? 30 : 50);
        
        // Чистая выгода
        const netGain = totalMonthlyGain - subscriptionCost;
        
        // Обновляем все значения в интерфейсе
        const resultElement = document.getElementById('roiResult');
        resultElement.innerHTML = `
            <h3 style="color: #2563eb; margin: 1.5rem 0;">Ваша потенциальная выгода</h3>
            <div class="number" id="monthlyGain" style="font-size: 2.5rem; font-weight: bold; color: #2563eb; margin-bottom: 1rem;">$${Math.round(netGain)}</div>
            <p>дополнительного дохода в месяц</p>
            <div class="gain-details" style="text-align: left; margin-top: 1rem; font-size: 0.9rem; background: #f8fafc; padding: 1rem; border-radius: 8px;">
                <p style="margin-bottom: 0.5rem;">• Оптимизация цен: +$${Math.round(priceGain * propertyCount)}</p>
                <p style="margin-bottom: 0.5rem;">• Снижение простоев: +$${Math.round(vacancyReduction * propertyCount)}</p>
                <p style="margin-bottom: 0.5rem;">• Экономия времени: +$${Math.round(timeValue * propertyCount)}</p>
                <p style="margin-bottom: 0.5rem;">• Стоимость подписки: -$${subscriptionCost}</p>
            </div>
            <div style="margin-top: 1.5rem;">
                <a href="contact.html?source=calculator&gain=${Math.round(netGain)}" class="btn btn-primary" style="width: 100%;">Начать экономить</a>
            </div>
        `;
        
        // Показываем результат
        resultElement.style.display = 'block';
        
        // Анимируем число
        animateNumber(0, netGain, 1000, value => {
            document.getElementById('monthlyGain').textContent = '$' + Math.round(value);
        });
    }
}

// Функция для плавной анимации чисел
function animateNumber(start, end, duration, callback) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = start + (end - start) * progress;
        callback(value);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Валидация ввода
function validateInput(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.getAttribute('min'));
    const max = parseInt(input.getAttribute('max'));
    
    if (value < min) input.value = min;
    if (value > max) input.value = max;
}

// Инициализация обработчиков событий
document.addEventListener('DOMContentLoaded', function() {
    const propertyCount = document.getElementById('propertyCount');
    const averageRent = document.getElementById('averageRent');
    
    // Добавляем валидацию при потере фокуса
    propertyCount.addEventListener('blur', () => validateInput(propertyCount));
    averageRent.addEventListener('blur', () => validateInput(averageRent));
    
    // Автоматический расчет при изменении значений
    propertyCount.addEventListener('change', calculateROI);
    averageRent.addEventListener('change', calculateROI);
});