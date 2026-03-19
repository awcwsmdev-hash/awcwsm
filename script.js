/**
 * Landing Page JavaScript
 */

// Force page to top on reload (prevents browser from remembering scroll position)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
    // Ensuring it scrolls up even if beforeunload failed
    window.scrollTo(0, 0);
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);

    // 0. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check saved theme or default to light (Olive Garden)
    const savedTheme = localStorage.getItem('mova-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) {
        themeIcon.setAttribute('icon', savedTheme === 'light' ? 'solar:moon-linear' : 'solar:sun-linear');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('mova-theme', newTheme);

            if (themeIcon) {
                themeIcon.setAttribute('icon', newTheme === 'light' ? 'solar:moon-linear' : 'solar:sun-linear');
            }
        });
    }

    // 1. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Scroll Animations
    // Target all elements with .fade-in-up class
    const fadeElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -100px 0px', // trigger when 100px from bottom screen
        threshold: 0.1 // 10% visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once faded in to keep it visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => scrollObserver.observe(el));

    // 3. Update Active Nav Link on Scroll
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Mobile Menu Toggle 
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            console.log('Mobile menu clicked');
        });
    }

    // 5. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all currently open ones (optional, for accordion effect)
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current one
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 6. Custom Country Select Logic
    const selectWrapper = document.getElementById('country-select');
    if (selectWrapper) {
        const selectTrigger = selectWrapper.querySelector('.custom-select-trigger');
        const customOptions = selectWrapper.querySelectorAll('.custom-option');
        const phoneInput = document.getElementById('phone-input');

        // Toggle dropdown open/close
        selectTrigger.addEventListener('click', (e) => {
            selectWrapper.classList.toggle('open');
            e.stopPropagation();
        });

        // Handle option selection
        customOptions.forEach(option => {
            option.addEventListener('click', function () {
                // Update active state
                customOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Update Trigger UI
                const newFlag = this.dataset.flag;
                const newPrefix = this.dataset.value;
                const newPlaceholder = this.dataset.placeholder;

                selectTrigger.querySelector('.flag-icon').textContent = newFlag;
                selectTrigger.querySelector('.prefix-text').textContent = newPrefix;

                // Update Input Placeholder
                if (phoneInput) {
                    phoneInput.placeholder = newPlaceholder;
                }

                // Close dropdown
                selectWrapper.classList.remove('open');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!selectWrapper.contains(e.target)) {
                selectWrapper.classList.remove('open');
            }
        });
    }

    // Background 8: Handwritten Dutch Words
    const initHandwrittenWords = () => {
        const canvas = document.getElementById('letters-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Dutch words & short phrases — mix of everyday, unique & educational
        const WORDS = [
            'gezellig', 'prachtig', 'geweldig', 'lekker', 'heerlijk',
            'dank je wel', 'alsjeblieft', 'goedemorgen', 'goedenavond',
            'tot ziens', 'hoe gaat het?', 'prima!', 'fantastisch',
            'ik leer Nederlands', 'spreekt u Nederlands?',
            'heel goed!', 'uitstekend', 'Nederland', 'Amsterdam',
            'welkom', 'groetjes', 'ja', 'nee', 'misschien',
            'ik hou van talen', 'een kopje koffie',
            'op de fiets', 'windmolen', 'tulpen', 'stroopwafel',
        ];

        // ── Theme colours ──────────────────────────────────────────────
        const getColor = () => {
            const light = document.documentElement.getAttribute('data-theme') === 'light';
            // Return an array of possible colors to pick from
            return light
                ? ['rgba(40,54,24,',   'rgba(96,108,56,',  'rgba(188,108,37,']
                : ['rgba(235,200,152,','rgba(255,215,100,', 'rgba(200,165,100,'];
        };

        // ── Word particle state ────────────────────────────────────────
        const MAX_WORDS = 10;
        let particles = [];

        const randBetween = (a, b) => a + Math.random() * (b - a);

        // ── Build exclusion zones from every visible hero element ──────
        const getExclusionZones = () => {
            const PAD = 28; // padding around each element
            const zones = [];
            const selectors = [
                '.hero-title', '.hero-subtitle', '.hero-ctas', '.btn',
                '.navbar', 'h1', 'p.hero-subtitle',
            ];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    const r = el.getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) {
                        zones.push({
                            x1: r.left - PAD, y1: r.top - PAD,
                            x2: r.right + PAD, y2: r.bottom + PAD,
                        });
                    }
                });
            });
            return zones;
        };

        // ── Check if a word rect overlaps any forbidden zone ──────────
        const overlapsZones = (x, y, halfW, halfH, zones) => {
            for (const z of zones) {
                if (x + halfW > z.x1 && x - halfW < z.x2 &&
                    y + halfH > z.y1 && y - halfH < z.y2) return true;
            }
            return false;
        };

        // ── Check if a word overlaps any existing live particle ────────
        const overlapsParticles = (x, y, halfW, halfH) => {
            for (const p of particles) {
                if (p.done) continue;
                const pHalfW = p.textW / 2 + 6; // Add padding for collision
                const pHalfH = p.fontSize * 0.8; // Add padding for collision
                if (x + halfW > p.x - pHalfW && x - halfW < p.x + pHalfW &&
                    y + halfH > p.y - pHalfH && y - halfH < p.y + pHalfH) return true;
            }
            return false;
        };

        const spawnWord = () => {
            const W = canvas.width;
            // ── Constrain to hero section only ──────────────────────
            const heroSection = document.getElementById('hero');
            const heroRect = heroSection ? heroSection.getBoundingClientRect() : null;
            const H = heroRect ? Math.max(heroRect.bottom, 0) : window.innerHeight;

            const exclusionZones = getExclusionZones();

            const text = WORDS[Math.floor(Math.random() * WORDS.length)];
            const fontSize = randBetween(20, 46);
            const colors = getColor();
            const color = colors[Math.floor(Math.random() * colors.length)];
            const baseAlpha = randBetween(0.22, 0.50);
            const angle = randBetween(-0.22, 0.22);

            ctx.font = `${Math.random() > 0.5 ? 600 : 400} ${fontSize}px 'Caveat', cursive`;
            const textW = ctx.measureText(text).width;
            const halfW = textW / 2 + 6; // Add padding for collision
            const halfH = fontSize * 0.8; // Add padding for collision
            const edgePad = halfW + 10;

            // Try up to 30 positions to find a non-overlapping spot
            let x, y, found = false;
            for (let attempt = 0; attempt < 30; attempt++) {
                x = randBetween(edgePad, W - edgePad);
                y = randBetween(fontSize + 10, H - fontSize - 10);
                if (!overlapsZones(x, y, halfW, halfH, exclusionZones) &&
                    !overlapsParticles(x, y, halfW, halfH)) {
                    found = true;
                    break;
                }
            }
            if (!found) return null; // no room — skip this spawn

            return {
                text, x, y,
                fontSize,
                fontWeight: Math.random() > 0.5 ? 600 : 400,
                color,
                baseAlpha,
                angle,
                textW,
                phase: 'reveal',
                revealProgress: 0,
                revealSpeed: randBetween(0.006, 0.014),
                holdTimer: 0,
                holdDuration: randBetween(200, 400),
                fadeAlpha: 1,
                fadeSpeed: randBetween(0.003, 0.007),
                done: false,
            };
        };

        // Seed initial words spread across the hero with staggered reveals
        for (let i = 0; i < MAX_WORDS; i++) {
            const p = spawnWord();
            if (!p) continue;
            p.revealProgress = Math.random();
            if (p.revealProgress >= 1) {
                p.phase = 'hold';
                p.holdTimer = Math.random() * p.holdDuration;
            }
            particles.push(p);
        }

        // ── Main draw loop ─────────────────────────────────────────────
        const draw = () => {
            requestAnimationFrame(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Hard-clip the canvas to the hero section so nothing bleeds below it
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const r = heroSection.getBoundingClientRect();
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, Math.max(r.top, 0), canvas.width, Math.max(r.bottom - Math.max(r.top, 0), 0));
                ctx.clip();
            }

            particles.forEach(p => {
                // Update state
                if (p.phase === 'reveal') {
                    p.revealProgress += p.revealSpeed;
                    if (p.revealProgress >= 1) {
                        p.revealProgress = 1;
                        p.phase = 'hold';
                    }
                } else if (p.phase === 'hold') {
                    p.holdTimer++;
                    if (p.holdTimer >= p.holdDuration) p.phase = 'fade';
                } else if (p.phase === 'fade') {
                    p.fadeAlpha -= p.fadeSpeed;
                    if (p.fadeAlpha <= 0) p.done = true;
                }

                if (p.done) return;

                const alpha = p.baseAlpha * p.fadeAlpha;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);

                // Clip to reveal the word left→right
                const clipW = p.textW * p.revealProgress + (p.phase !== 'reveal' ? p.textW : 0);
                ctx.beginPath();
                ctx.rect(-p.textW / 2 - 4, -p.fontSize, Math.min(clipW, p.textW + 8), p.fontSize * 1.4);
                ctx.clip();

                ctx.font = `${p.fontWeight} ${p.fontSize}px 'Caveat', cursive`;
                ctx.fillStyle = p.color + alpha + ')';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.text, 0, 0);

                // Underline — like a teacher underlining a word
                if (p.phase === 'hold' || p.phase === 'fade') {
                    ctx.beginPath();
                    ctx.moveTo(-p.textW / 2, p.fontSize * 0.35);
                    ctx.lineTo(p.textW / 2 * p.revealProgress, p.fontSize * 0.35 + Math.sin(p.revealProgress * 4) * 1.5);
                    ctx.strokeStyle = p.color + (alpha * 0.5) + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                ctx.restore();
            });

            // Restore hero clip
            if (heroSection) ctx.restore();

            // Remove done particles and spawn new ones into the hero zone
            particles = particles.filter(p => !p.done);
            while (particles.length < MAX_WORDS) {
                const p = spawnWord();
                if (p) particles.push(p);
                else break; // no room right now
            }
        };


        // Re-randomize colors on theme toggle
        (() => {
            const obs = new MutationObserver(() => {});
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        })();

        draw();
    };

    initHandwrittenWords();
});
