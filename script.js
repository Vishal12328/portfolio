document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const elements = {
        cursor: document.querySelector('.cursor'),
        hamburgerMenu: document.getElementById('hamburgerMenu'),
        offscreenMenu: document.getElementById('offscreenMenu'),
        pageContainer: document.querySelector('.page-container'),
        tabButtons: document.querySelectorAll('.tab-button'),
        contactForm: document.getElementById('contactForm'),
        scrollToTopBtn: document.createElement('div'),
        themeToggle: document.createElement('div')
    };

    // Constants
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animationDuration = prefersReducedMotion.matches ? '0s' : '0.3s';

    // Initialize UI Elements
    const initUI = () => {
        elements.scrollToTopBtn.className = 'scroll-to-top';
        elements.scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(elements.scrollToTopBtn);

        elements.themeToggle.className = 'theme-toggle';
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
        document.body.appendChild(elements.themeToggle);
    };

    // Theme Management
    const themeManager = {
        setTheme(isLight) {
            document.body.classList.toggle('light-theme', isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        },
        init() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') this.setTheme(true);
            elements.themeToggle.addEventListener('click', () => this.setTheme(!document.body.classList.contains('light-theme')));
        }
    };

    // Cursor Management
    const cursorManager = {
        init() {
            document.addEventListener('mousemove', e => {
                const isInteractive = e.target.closest('a, button, .hamburger-menu, .image-container');
                elements.cursor.style.transform = `translate(-50%, -50%) scale(${isInteractive ? 1.5 : 1})`;
                elements.cursor.style.left = `${e.clientX}px`;
                elements.cursor.style.top = `${e.clientY}px`;
            });
            document.addEventListener('mouseout', () => elements.cursor.style.opacity = '0');
            document.addEventListener('mouseover', () => elements.cursor.style.opacity = '1');
        }
    };

    // Menu Management
    const menuManager = {
        toggle() {
            elements.hamburgerMenu.classList.toggle('active');
            elements.offscreenMenu.classList.toggle('active');
            elements.pageContainer.classList.toggle('menu-open');
            if (isMobile) document.body.style.overflow = elements.offscreenMenu.classList.contains('active') ? 'hidden' : '';
        },
        init() {
            elements.hamburgerMenu.addEventListener('click', () => this.toggle());
            document.querySelectorAll('.offscreen-menu a').forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    const sectionId = link.getAttribute('data-section');
                    if (!sectionId) return;
                    this.toggle();
                    setTimeout(() => this.scrollToSection(sectionId), 300);
                });
            });
        },
        scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const navHeight = document.querySelector('nav').offsetHeight;
                window.scrollTo({
                    top: section.offsetTop - navHeight - 20,
                    behavior: 'smooth'
                });
            }
        }
    };

    // Tab Management
    const tabManager = {
        init() {
            elements.tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    elements.tabButtons.forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                    button.classList.add('active');
                    document.getElementById(button.getAttribute('data-tab')).classList.add('active');
                });
            });
            if (elements.tabButtons.length) elements.tabButtons[0].click();
        }
    };

    // Form Management
    const formManager = {
        init() {
            if (!elements.contactForm) return;
            elements.contactForm.addEventListener('submit', e => {
                e.preventDefault();
                const formData = new FormData(elements.contactForm);
                const name = formData.get('name');
                elements.contactForm.innerHTML = `
                    <div class="success-message">
                        <h3>Thank you, ${name}!</h3>
                        <p>Your message has been received. I'll get back to you soon.</p>
                    </div>
                `;
            });
        }
    };

    // Skills Animation
    const skillsManager = {
        init() {
            const skillProgressBars = document.querySelectorAll('.skill-progress');
            const skillsObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        skillProgressBars.forEach(bar => {
                            bar.style.width = bar.getAttribute('data-progress');
                        });
                        skillsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            const skillsSection = document.querySelector('.skills-section');
            if (skillsSection) skillsObserver.observe(skillsSection);
        }
    };

    // Scroll Management
    const scrollManager = {
        init() {
            window.addEventListener('scroll', () => {
                elements.scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
            });
            elements.scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    // Mobile Optimizations
    const mobileManager = {
        init() {
            if (!isMobile) return;
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', e => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        if (elements.offscreenMenu.classList.contains('active')) menuManager.toggle();
                    }
                });
            });

            let touchStartX = 0;
            document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
            document.addEventListener('touchend', e => {
                const swipeDistance = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(swipeDistance) > 50) {
                    if (swipeDistance > 0 && elements.offscreenMenu.classList.contains('active')) {
                        menuManager.toggle();
                    } else if (swipeDistance < 0 && !elements.offscreenMenu.classList.contains('active')) {
                        menuManager.toggle();
                    }
                }
            });

            window.addEventListener('orientationchange', () => {
                if (elements.offscreenMenu.classList.contains('active')) menuManager.toggle();
            });
        }
    };

    // Initialize all managers
    const init = () => {
        initUI();
        themeManager.init();
        cursorManager.init();
        menuManager.init();
        tabManager.init();
        formManager.init();
        skillsManager.init();
        scrollManager.init();
        mobileManager.init();
        document.documentElement.style.setProperty('--transition-speed', animationDuration);
        document.body.classList.add('loaded');
    };

    init();
});