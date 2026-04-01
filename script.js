

document.addEventListener('DOMContentLoaded', () => {

    // ── CUSTOM CURSOR ──────────────────────────────────────────
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand ring on interactive elements
    document.querySelectorAll('a, button, .car-card, .member-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '60px';
            ring.style.height = '60px';
            ring.style.opacity = '0.5';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '36px';
            ring.style.height = '36px';
            ring.style.opacity = '1';
        });
    });

    // ── NAVBAR SCROLL ──────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ── SCROLL REVEAL ──────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--d') || '0ms';
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay) || 0);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => revealObs.observe(el));

    // ── COUNT-UP ANIMATION ─────────────────────────────────────
    function countUp(el) {
        const target = parseInt(el.dataset.target);
        const duration = 1600;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-num[data-target]').forEach(countUp);
                counterObs.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.hero-stats');
    if (statsBar) counterObs.observe(statsBar);

    // ── SMOOTH ANCHOR SCROLL ───────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── PAGE TRANSITION (fade out on leave) ───────────────────
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
            link.addEventListener('click', e => {
                e.preventDefault();
                document.body.style.transition = 'opacity 0.4s ease';
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = href; }, 400);
            });
        }
    });

    // ── PARALLAX HERO ──────────────────────────────────────────
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            heroBg.style.transform = `translateY(${y * 0.4}px)`;
        }, { passive: true });
    }

});