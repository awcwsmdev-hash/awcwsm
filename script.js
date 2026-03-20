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

});
