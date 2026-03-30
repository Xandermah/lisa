/* ══════════════════════════════════════════
   ЕЛИЗАВЕТА МАХОНИНА — PR-руководитель
   Скрипт: курсор, анимации, интерактив
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollAnimations();
    initNavigation();
    initSmoothScroll();
    initLanguageBars();
    //initParticles();
    initCounters();
    initMagneticButtons();
    initTiltCards();
});

/* ── Кастомный курсор ── */
function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    // Проверяем тач-устройства
    if ('ontouchstart' in window) return;

    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });

    // Плавная анимация кольца
    function animateRing() {
        rx += (mx - rx) * .15;
        ry += (my - ry) * .15;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Эффект при наведении на ссылки и кнопки
    const hovers = document.querySelectorAll('a, button, .case-tile, .comp-card, .toolkit-cloud span');
    hovers.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
}

/* ── Анимации при скролле ── */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent ? Array.from(parent.querySelectorAll('.anim-scroll')) : [];
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Math.min(idx * 80, 400));
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.08 });

    document.querySelectorAll('.anim-scroll').forEach(el => observer.observe(el));
}

/* ── Навигация ── */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    const closeMobileMenu = () => {
        if (navToggle) navToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (mobileMenuBackdrop) mobileMenuBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
        if (navToggle) navToggle.classList.add('active');
        if (mobileMenu) mobileMenu.classList.add('open');
        if (mobileMenuBackdrop) mobileMenuBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    if (navToggle && mobileMenu && mobileMenuBackdrop) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

        mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-links .nav-link');

    const activeObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkEls.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(s => activeObs.observe(s));
}

/* ── Плавный скролл ── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navH = document.getElementById('nav').offsetHeight;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
            }
        });
    });
}

/* ── Полоски языков ── */
function initLanguageBars() {
    const fills = document.querySelectorAll('.lang-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const w = entry.target.getAttribute('data-w');
                if (w) entry.target.style.width = w;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    fills.forEach(f => observer.observe(f));
}

/* ── Плавающие частицы в Hero ── */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.classList.add('hero-particle');
        const size = Math.random() * 4 + 2;
        p.style.setProperty('--size', size + 'px');
        p.style.setProperty('--tx', (Math.random() * 200 - 100) + 'px');
        p.style.setProperty('--ty', (Math.random() * -300 - 50) + 'px');
        p.style.setProperty('--dur', (Math.random() * 8 + 6) + 's');
        p.style.setProperty('--delay', (Math.random() * 6) + 's');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        container.appendChild(p);
    }
}

/* ── Анимация счётчиков ── */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                if (isNaN(target)) return;
                
                let current = 0;
                const step = Math.max(1, Math.floor(target / 60));
                const duration = 1500;
                const interval = duration / (target / step);
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current;
                }, interval);
                
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ── Магнитные кнопки ── */
function initMagneticButtons() {
    if ('ontouchstart' in window) return;
    
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ── Тилт-эффект на карточках ── */
function initTiltCards() {
    if ('ontouchstart' in window) return;

    document.querySelectorAll('.comp-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
