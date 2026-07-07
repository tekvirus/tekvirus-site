// ============================================================
// MAIN APP INTERACTIONS
// ============================================================

class MainApp {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollReveal();
        this.initSmoothScroll();
        this.initCounterAnimation();
        this.initParallax();
    }

    initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-aos]');

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 130;

            revealElements.forEach((element) => {
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < windowHeight - revealPoint) {
                    element.classList.add('aos-animate');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        window.addEventListener('load', revealOnScroll);
        revealOnScroll();
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId.length < 2) return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    }

    initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const animateCounter = (element) => {
            const target = parseInt(element.dataset.target, 10) || 0;
            const suffix = element.dataset.suffix || '+';
            const duration = 1600;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    element.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + suffix;
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach((number) => observer.observe(number));
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-3d-icon, .about-image-container');
            parallaxElements.forEach((element) => {
                element.style.transform = `translateY(${scrolled * 0.04}px)`;
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});
