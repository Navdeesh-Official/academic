document.addEventListener('DOMContentLoaded', function () {

    // =========================================
    // ELEMENTS
    // =========================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.getElementById('scrollProgress');
    const progressFill = scrollProgress ? scrollProgress.querySelector('.progress-fill') : null;
    const sections = document.querySelectorAll('.section, .hero');

    // Tabs
    const introTabs = document.querySelectorAll('.intro-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const perfTabs = document.querySelectorAll('.perf-tab');
    const perfPanels = document.querySelectorAll('.perf-panel');

    // Subject rows
    const subjectRows = document.querySelectorAll('.subject-row');

    // =========================================
    // MOBILE NAVIGATION
    // =========================================
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    }

    // =========================================
    // SCROLL PROGRESS
    // =========================================
    function updateScrollProgress() {
        if (!progressFill) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        progressFill.style.width = Math.min(progress, 100) + '%';
    }

    // =========================================
    // ACTIVE SECTION
    // =========================================
    function updateActiveSection() {
        let currentSection = '';

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // =========================================
    // INTRO TABS (Bio / Goals)
    // =========================================
    introTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const targetPanel = this.dataset.tab;

            // Update tab states
            introTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update panel states
            tabPanels.forEach(function (panel) {
                panel.classList.remove('active');
                if (panel.dataset.panel === targetPanel) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // =========================================
    // PERFORMANCE TABS (Overview / Breakdown)
    // =========================================
    perfTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const targetPanel = this.dataset.perfTab;

            // Update tab states
            perfTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update panel states
            perfPanels.forEach(function (panel) {
                panel.classList.remove('active');
                if (panel.dataset.perfPanel === targetPanel) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // =========================================
    // EXPANDABLE SUBJECT ROWS
    // =========================================
    subjectRows.forEach(function (row) {
        const header = row.querySelector('.subject-row-header');
        const expandBtn = row.querySelector('.subject-expand');

        if (header) {
            header.addEventListener('click', function (e) {
                // Don't trigger if clicking on expand button directly (it will handle itself)
                if (e.target.closest('.subject-expand')) return;

                toggleRow(row);
            });
        }

        if (expandBtn) {
            expandBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleRow(row);
            });
        }
    });

    function toggleRow(row) {
        const isExpanded = row.classList.contains('expanded');
        const expandBtn = row.querySelector('.subject-expand');

        // Close all other rows
        subjectRows.forEach(function (otherRow) {
            if (otherRow !== row) {
                otherRow.classList.remove('expanded');
                const btn = otherRow.querySelector('.subject-expand');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current row
        row.classList.toggle('expanded');
        if (expandBtn) {
            expandBtn.setAttribute('aria-expanded', !isExpanded);
        }
    }

    // =========================================
    // SMOOTH SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =========================================
    // SCROLL HANDLER (Throttled)
    // =========================================
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateScrollProgress();
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial calls
    updateScrollProgress();
    updateActiveSection();

    // =========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // =========================================
    const animateOnScroll = document.querySelectorAll('.trust-badge, .strength-card, .timeline-step, .breakdown-card');

    const fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateOnScroll.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(el);
    });

    // =========================================
    // KEYBOARD ACCESSIBILITY
    // =========================================
    subjectRows.forEach(function (row) {
        const header = row.querySelector('.subject-row-header');
        if (header) {
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleRow(row);
                }
            });
        }
    });

    // =========================================
    // REDUCED MOTION
    // =========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        animateOnScroll.forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
    }

});

