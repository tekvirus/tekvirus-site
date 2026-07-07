// ============================================================
// NAVIGATION
// ============================================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('navMenu');
        this.navToggle = document.getElementById('navToggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScroll = 0;

        this.init();
    }

    init() {
        this.navToggle.addEventListener('click', () => this.toggleMenu());

        this.navLinks.forEach((link) => {
            link.addEventListener('click', () => this.closeMenu());
        });

        window.addEventListener('scroll', () => this.handleScroll());

        this.updateActiveLink();
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');

        const spans = this.navToggle.querySelectorAll('span');
        if (this.navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');

        const spans = this.navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        if (currentScroll > this.lastScroll && currentScroll > 500) {
            this.navbar.classList.add('navbar-hidden');
        } else {
            this.navbar.classList.remove('navbar-hidden');
        }

        this.lastScroll = currentScroll;
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});
