document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const cursor = document.querySelector('.cursor');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const offscreenMenu = document.getElementById('offscreenMenu');
    const pageContainer = document.querySelector('.page-container');
    const tabButtons = document.querySelectorAll('.tab-button');
    const contactForm = document.getElementById('contactForm');
    const scrollToTopBtn = document.createElement('div');
    const themeToggle = document.createElement('div');

    // Add scroll to top button
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);

    // Add theme toggle button
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
    document.body.appendChild(themeToggle);

    // Theme handling
    const setTheme = (isLight) => {
        if (isLight) {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    };

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setTheme(true);
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        setTheme(!isLight);
    });

    // Custom cursor
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.transform = e.target.closest('a, button, .hamburger-menu, .image-container') ?
            'translate(-50%, -50%) scale(1.5)' :
            'translate(-50%, -50%) scale(1)';
    });

    // Hide/show cursor
    document.addEventListener('mouseout', () => cursor.style.opacity = '0');
    document.addEventListener('mouseover', () => cursor.style.opacity = '1');

    // Toggle menu
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        offscreenMenu.classList.toggle('active');
        pageContainer.classList.toggle('menu-open');

        // Animation delay for menu items
        if (offscreenMenu.classList.contains('active')) {
            document.querySelectorAll('.offscreen-menu ul li').forEach((item, index) => {
                item.style.setProperty('--i', index);
            });
        }
    });

    // Menu link handling with smooth scroll
    document.querySelectorAll('.offscreen-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const sectionId = link.getAttribute('data-section');
            if (!sectionId) return;

            const section = document.getElementById(sectionId);

            // Close menu
            hamburgerMenu.classList.remove('active');
            offscreenMenu.classList.remove('active');
            pageContainer.classList.remove('menu-open');

            if (section) {
                // Add a small delay to allow menu closing animation to complete
                setTimeout(() => {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const sectionTop = section.offsetTop - navHeight - 20; // Added extra padding

                    window.scrollTo({
                        top: sectionTop,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(button.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');

            // Show submission confirmation
            contactForm.innerHTML = `
                <div class="success-message">
                    <h3>Thank you, ${name}!</h3>
                    <p>Your message has been received. I'll get back to you soon.</p>
                </div>
            `;
        });
    }

    // Initialize first tab as active
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }

    // Animate skill progress bars
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const animateSkills = () => {
        skillProgressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress;
        });
    };

    // Intersection Observer for skill animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Scroll to top functionality
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add loading animation
    document.body.classList.add('loaded');
});