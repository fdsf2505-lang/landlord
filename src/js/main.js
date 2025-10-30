// Main interactive script for Landlord.AI

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

        // Debug info about reveal elements
        const revealElements = document.querySelectorAll('.reveal');
        console.log(`[Debug] Found ${revealElements.length} elements with .reveal class`);

        // Reveal elements on scroll (supports stagger via --item-index)
        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const shouldReveal = window.innerWidth >= 1024 || rect.top < window.innerHeight - 80;
                if (shouldReveal && !el.classList.contains('active')) {
                    const idx = parseFloat(getComputedStyle(el).getPropertyValue('--item-index')) || 0;
                    el.style.transitionDelay = `${idx * 120}ms`;
                    el.classList.add('active');
                    console.log(`[Debug] Activated element with index ${idx}:`, el.querySelector('h3')?.textContent || el.className);
                }
            });
        };

        // Initial run and scroll listener
        revealOnScroll();
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

        // Parallax hero background
        const hero = document.querySelector('.hero');
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (hero) hero.style.backgroundPosition = `50% ${scrolled * 0.5}px`;
        });

        // Intersection observer to toggle .active on sections
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
        }, observerOptions);
        document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

        // Initialize Market trends chart (handles research multi-year series)
        function initMarketTrends() {
            const canvas = document.getElementById('marketTrends');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const isYears = canvas.dataset.chart === 'years' || window.location.pathname.includes('research.html');
            if (isYears) {
                try {
                    // create gradient fill that adapts to canvas height
                    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height || 400);
                    gradient.addColorStop(0, 'rgba(37,99,235,0.20)');
                    gradient.addColorStop(0.6, 'rgba(37,99,235,0.08)');
                    gradient.addColorStop(1, 'rgba(37,99,235,0.02)');

                    const chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
                            datasets: [{ label: 'Средняя цена аренды ($)', data: [420, 470, 510, 560, 610, 660], borderColor: '#1e40af', backgroundColor: gradient, fill: true, tension: 0.35, pointRadius: 4, borderWidth: 2 }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: { mode: 'index', intersect: false },
                            plugins: {
                                title: { display: true, text: 'Рост цен на аренду (2020–2025)' },
                                tooltip: { callbacks: { label: ctx => `$ ${ctx.formattedValue}` } },
                                legend: { display: false }
                            },
                            scales: {
                                x: { grid: { color: 'rgba(11,46,110,0.03)' } },
                                y: { grid: { color: 'rgba(11,46,110,0.03)' }, ticks: { callback: v => `$${v}` } }
                            },
                            animation: { duration: 800, easing: 'cubicInOut' }
                        }
                    });
                    window.marketTrendsChart = chart;
                    if (typeof chart.resize === 'function') chart.resize();
                    chart.update();
                    console.log('[Debug] marketTrends chart initialized', chart);
                } catch (err) { console.warn('Chart init error', err); }
            } else {
                try {
                    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height || 300);
                    gradient.addColorStop(0, 'rgba(37,99,235,0.14)');
                    gradient.addColorStop(1, 'rgba(37,99,235,0.02)');
                    const chart = new Chart(ctx, {
                        type: 'line',
                        data: { labels: ['Янв','Фев','Мар','Апр','Май','Июн'], datasets: [{ label: 'Средняя цена аренды ($/мес)', data: [500,520,540,580,600,650], borderColor:'#1e40af', backgroundColor:gradient, fill:true, tension:0.3, pointRadius:3, borderWidth:2 }] },
                        options:{ responsive:true, maintainAspectRatio:false, interaction:{ mode:'index', intersect:false }, plugins:{ tooltip:{ callbacks:{ label: ctx=>`$ ${ctx.formattedValue}` } }, legend:{ display:false } }, scales:{ x:{ grid:{ color:'rgba(11,46,110,0.03)' } }, y:{ grid:{ color:'rgba(11,46,110,0.03)' }, ticks:{ callback: v=>`$${v}` } } }, animation:{ duration:600 } }
                    });
                    window.marketTrendsChart = chart;
                    if (typeof chart.resize === 'function') chart.resize();
                    chart.update();
                    console.log('[Debug] marketTrends monthly chart initialized', chart);
                } catch (err) { console.warn('Chart init error', err); }
            }
        }

        // mini chart for calculator
        function initMiniChart(recommended) {
            const el = document.getElementById('miniForecast');
            if (!el) return;
            try {
                const ctx = el.getContext('2d');
                new Chart(ctx, { type: 'bar', data: { labels:['Рекоменд.' ], datasets:[{ label:'$', data:[recommended||0], backgroundColor:'#2563eb' }] }, options:{ responsive:true, plugins:{ legend:{ display:false } } } });
            } catch(e){ console.warn('miniChart error', e); }
        }

        // Leaflet map init
        function initLeaflet() {
            const mapEl = document.getElementById('map');
            if (!mapEl) { console.warn('[Leaflet] map element #map not found'); return; }

            // Retry-safe init (in case L isn't loaded yet)
            let attempts = 0;
            const tryInit = () => {
                attempts++;
                if (typeof L === 'undefined') {
                    console.warn(`[Leaflet] L is undefined (attempt ${attempts}).`);
                    if (attempts < 6) return setTimeout(tryInit, 300);
                    console.error('[Leaflet] failed to load after multiple attempts. Map will not be initialized.');
                    return;
                }

                try {
                    const map = L.map('map').setView([42.8746, 74.5698], 12);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(map);
                    const markers = [ { name:'Асанбай', lat:42.876, lon:74.600, price:'$500', trend:'+12%/г' }, { name:'Орто-Сай', lat:42.871, lon:74.601, price:'$420', trend:'+10%/г' }, { name:'Центр', lat:42.874, lon:74.593, price:'$650', trend:'+15%/г' } ];

                    // use circle markers with a clear style for better visual quality
                    markers.forEach(m => {
                        L.circleMarker([m.lat, m.lon], { radius: 7, fillColor: '#2563eb', color: '#1e40af', weight: 1, fillOpacity: 0.95 }).addTo(map)
                            .bindPopup(`<strong>${m.name}</strong><div>Средняя цена: ${m.price}</div><div>Рост: ${m.trend}</div>`);
                    });

                    // ensure map layout is correct
                    setTimeout(()=>{ try{ map.invalidateSize(); }catch(e){} }, 120);
                    console.log('[Leaflet] map initialized with circle markers');
                } catch (err) {
                    console.error('[Leaflet] error initializing map', err);
                }
            };

            tryInit();
        }

        // Counters animation
        function initCounters() {
            const counters = document.querySelectorAll('.counter');
            if (!counters.length) return;
            const run = el => {
                const target = +el.dataset.target; let cur = 0; const step = Math.max(1, Math.round(target/60));
                const tick = ()=>{ cur+=step; if (cur>=target) el.textContent = target + (el.dataset.suffix||''); else { el.textContent=cur; requestAnimationFrame(tick); } };
                tick();
            };
            const obs = new IntersectionObserver(entries=>{ entries.forEach(entry=>{ if(entry.isIntersecting){ run(entry.target); obs.unobserve(entry.target); } }); }, { threshold:0.3 });
            counters.forEach(c=>obs.observe(c));
        }

        // Simple form validation stub
        function initFormValidation(){ document.querySelectorAll('form').forEach(form=>{ form.addEventListener('submit', e=>{ e.preventDefault(); console.log('Форма отправлена', new FormData(form)); }); }); }

        // Wire up initializers on DOM ready
        document.addEventListener('DOMContentLoaded', ()=>{
            revealOnScroll();
            initMarketTrends();
            initLeaflet();
            initCounters();
            initFormValidation();
            window.initMiniChart = initMiniChart;
        });