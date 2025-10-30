// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Debug info about reveal elements
const revealElements = document.querySelectorAll('.reveal');
console.log(`[Debug] Found ${revealElements.length} elements with .reveal class`);

// Reveal elements on scroll (using .reveal class and supporting stagger via --item-index)
const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Auto-reveal on large screens or when in view on mobile
        const shouldReveal = window.innerWidth >= 1024 || rect.top < window.innerHeight - 80;
        
        if (shouldReveal && !el.classList.contains('active')) {
            const idx = parseFloat(getComputedStyle(el).getPropertyValue('--item-index')) || 0;
            el.style.transitionDelay = `${idx * 120}ms`;
            el.classList.add('active');
            console.log(`[Debug] Activated element with index ${idx}:`, el.querySelector('h3')?.textContent || 'unnamed');
        }
    });
};

// Initial check
revealOnScroll();

// Throttled scroll listener
let tId = null;
window.addEventListener('scroll', () => {
    if (tId) cancelAnimationFrame(tId);
    tId = requestAnimationFrame(revealOnScroll);
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPosition = `50% ${scrolled * 0.5}px`;
    }
});

// Market trends chart
const ctx = document.getElementById('marketTrends')?.getContext('2d');
if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            datasets: [{
                label: 'Средняя цена аренды ($/мес)',
                data: [500, 520, 540, 580, 600, 650],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Динамика цен на рынке',
                    color: '#0b2a66',
                    font: { size: 16, family: 'Inter' }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(0,0,0,0.04)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// Add intersection observer for section animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});