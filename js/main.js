// ================================================
// CLEAN NAVIGATION JAVASCRIPT
// ================================================

$(document).ready(function() {
    "use strict";
    
    // Initialize
    initFlexNav();
    initScrollEffects();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
});

// ================================================
// FLEXNAV (HAMBURGER MENU)
// ================================================
function initFlexNav() {
    const menuButton = $('#menu-center .menu-button');
    const nav = $('.flexnav.standard');
    const submenuItems = nav.find('.nav-has-submenu');
    const submenuToggles = submenuItems.find('.nav-submenu-toggle');
    const submenuParentLinks = submenuItems.find('.nav-mobile-parent > a');
    if (!menuButton.length || !nav.length) return;

    function closeSubmenus() {
        submenuItems.removeClass('submenu-open');
        submenuToggles.attr('aria-expanded', 'false');
    }

    function toggleSubmenu(parentItem, trigger) {
        const isOpen = parentItem.hasClass('submenu-open');

        submenuItems.not(parentItem).removeClass('submenu-open');
        submenuToggles.not(trigger).attr('aria-expanded', 'false');

        parentItem.toggleClass('submenu-open', !isOpen);
        parentItem.find('.nav-submenu-toggle').attr('aria-expanded', !isOpen ? 'true' : 'false');
    }

    function setMenuState(isMenuOpen) {
        nav.toggleClass('flexnav-show', isMenuOpen);
        menuButton.toggleClass('menu-open', !isMenuOpen);
        menuButton.toggleClass('menu-close', isMenuOpen);
        menuButton.attr('aria-expanded', isMenuOpen ? 'true' : 'false');

        if (!isMenuOpen) {
            closeSubmenus();
        }
    }

    menuButton.off('click.flexnav').on('click.flexnav', function(event) {
        if (window.innerWidth > 1024) return;
        event.preventDefault();
        event.stopPropagation();
        setMenuState(!nav.hasClass('flexnav-show'));
    });

    nav.find('a').off('click.flexnav').on('click.flexnav', function() {
        if (window.innerWidth > 1024) return;
        if ($(this).closest('.nav-mobile-parent').length) return;
        setMenuState(false);
    });

    submenuToggles.off('click.flexnav').on('click.flexnav', function(event) {
        const parentItem = $(this).closest('.nav-has-submenu');

        if (window.innerWidth > 1024) return;
        event.preventDefault();
        event.stopPropagation();
        toggleSubmenu(parentItem, this);
    });

    submenuParentLinks.off('click.flexnav').on('click.flexnav', function(event) {
        const parentItem = $(this).closest('.nav-has-submenu');

        if (window.innerWidth > 1024) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleSubmenu(parentItem, parentItem.find('.nav-submenu-toggle').get(0));
    });

    $(window).off('resize.flexnav').on('resize.flexnav', function() {
        if (window.innerWidth > 1024) {
            setMenuState(false);
        }
    });

    setMenuState(false);
}

// ================================================
// SCROLL EFFECTS
// ================================================
function initScrollEffects() {
    const header = $('#header');
    if (!header.length) return;

    let lastScrollTop = $(window).scrollTop();
    let ticking = false;
    const hideOffset = 110;
    const scrollDelta = 6;
    
    function updateHeaderState() {
        const currentScrollTop = $(window).scrollTop();

        if (currentScrollTop > 0) {
            header.addClass('is-scrolled');
        } else {
            header.removeClass('is-scrolled');
        }

        if (header.hasClass('scroll-hide')) {
            const navIsOpen =
                header.find('.flexnav.standard').hasClass('flexnav-show') ||
                header.find('.mobile-menu-toggle').hasClass('active');

            if (navIsOpen || currentScrollTop <= hideOffset) {
                header.removeClass('hide');
            } else {
                const scrollDiff = currentScrollTop - lastScrollTop;

                if (Math.abs(scrollDiff) > scrollDelta) {
                    if (scrollDiff > 0) {
                        header.addClass('hide');
                    } else {
                        header.removeClass('hide');
                    }
                }
            }
        }

        lastScrollTop = Math.max(currentScrollTop, 0);
        ticking = false;
    }
    
    updateHeaderState();
    $(window).on('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeaderState);
            ticking = true;
        }
    });

    $(window).on('resize', updateHeaderState);
}

// ================================================
// MOBILE MENU TOGGLE
// ================================================
function initMobileMenu() {
    const toggle = $('.mobile-menu-toggle');
    const nav = $('.main-nav');
    const navLinks = $('.nav-link');
    
    toggle.on('click', function() {
        const isActive = nav.hasClass('active');
        
        nav.toggleClass('active');
        toggle.toggleClass('active');
        toggle.attr('aria-expanded', !isActive);
    });
    
    navLinks.on('click', function() {
        if (window.innerWidth <= 800) {
            nav.removeClass('active');
            toggle.removeClass('active');
            toggle.attr('aria-expanded', 'false');
        }
    });
    
    $(window).on('resize', function() {
        if (window.innerWidth > 800) {
            nav.removeClass('active');
            toggle.removeClass('active');
            toggle.attr('aria-expanded', 'false');
        }
    });
}

// ================================================
// SMOOTH SCROLL & ACTIVE STATES
// ================================================
function initSmoothScroll() {
    const navLinks = $('.nav-desktop-links .nav-primary-link, #menu-center .flexnav.standard > li > .nav-primary-link');
    const sectionLinks = navLinks.filter(function() {
        const href = $(this).attr('href');
        return href && href.startsWith('#');
    });

    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.hash);
        
        if (target.length) {
            e.preventDefault();

            const isTopAnchor = this.hash === '#top';
            const hash = this.hash;

            sectionLinks.removeClass('active');
            sectionLinks.filter(`[href="${hash}"]`).addClass('active');
            
            $('html, body').animate({
                scrollTop: isTopAnchor ? 0 : target.offset().top - 75
            }, 600, 'swing');
            
            if (history.pushState) {
                history.pushState(null, null, this.hash);
            }
        }
    });
    
    $(window).on('scroll', updateActiveNavLinks);
    updateActiveNavLinks();
    
    function updateActiveNavLinks() {
        const scrollPos = $(window).scrollTop() + 120;
        let activeHref = '#top';

        sectionLinks.each(function() {
            const href = $(this).attr('href');
            const section = $(href);

            if (!section.length || href === '#top') {
                return;
            }

            if (scrollPos >= section.offset().top) {
                activeHref = href;
            }
        });

        sectionLinks.removeClass('active');
        sectionLinks.filter(`[href="${activeHref}"]`).addClass('active');
    }
}

// ================================================
// BACK TO TOP BUTTON
// ================================================
function initBackToTop() {
    const backToTop = $('.scrolltotop');
    
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 600) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    });
    
    backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
    
    backToTop.on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });
}

// ================================================
// HERO ICON PARALLAX (DESKTOP)
// ================================================
function initFloatingIconsParallax() {
    const icons = Array.from(document.querySelectorAll('.floating-icon'));
    const hero = document.querySelector('.hero-wrapper');

    if (!icons.length || !hero) {
        return;
    }

    const desktopMediaQuery = window.matchMedia('(min-width: 1181px)');
    const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let rafPending = false;

    function resetParallax() {
        icons.forEach((icon) => {
            icon.style.setProperty('--icon-parallax-x', '0px');
            icon.style.setProperty('--icon-parallax-y', '0px');
        });
    }

    function updateParallax() {
        rafPending = false;

        if (!desktopMediaQuery.matches || reducedMotionMediaQuery.matches) {
            resetParallax();
            return;
        }

        const maxScroll = Math.max(hero.offsetHeight * 0.95, window.innerHeight * 0.7);
        const progress = Math.min((window.scrollY || window.pageYOffset) / maxScroll, 1);

        icons.forEach((icon) => {
            const isLeft = icon.classList.contains('floating-icon-left');
            const depth = parseFloat(icon.dataset.parallaxDepth || '1');
            const xOffset = 190 * depth * progress * (isLeft ? -1 : 1);
            const yOffset = -26 * depth * progress;

            icon.style.setProperty('--icon-parallax-x', `${xOffset.toFixed(2)}px`);
            icon.style.setProperty('--icon-parallax-y', `${yOffset.toFixed(2)}px`);
        });
    }

    function requestUpdate() {
        if (rafPending) {
            return;
        }

        rafPending = true;
        window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    if (typeof desktopMediaQuery.addEventListener === 'function') {
        desktopMediaQuery.addEventListener('change', requestUpdate);
        reducedMotionMediaQuery.addEventListener('change', requestUpdate);
    } else if (typeof desktopMediaQuery.addListener === 'function') {
        desktopMediaQuery.addListener(requestUpdate);
        reducedMotionMediaQuery.addListener(requestUpdate);
    }

    updateParallax();
}

// ================================================
// EXISTING FUNCTIONALITY
// ================================================

$('#hero-slider').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    navText: ['<i class="ion-ios-arrow-thin-left"></i>', '<i class="ion-ios-arrow-thin-right"></i>'],
    navSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
});

$('#portfolio-slider').owlCarousel({
    center: true,
    items: 1,
    loop: true,
    margin: 30,
    nav: true,
    navText: ['<i class="ion-ios-arrow-thin-left"></i>', '<i class="ion-ios-arrow-thin-right"></i>'],
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: { 1024: { items: 2 } },
});

$('#portfolio-slider2').owlCarousel({
    items: 1,
    loop: true,
    margin: 30,
    nav: true,
    navText: ['<i class="ion-ios-arrow-thin-left"></i>', '<i class="ion-ios-arrow-thin-right"></i>'],
    navSpeed: 2000,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
});

$('#portfolio-slider3').owlCarousel({
    items: 1,
    loop: true,
    margin: 30,
    nav: true,
    navText: ['<i class="ion-ios-arrow-thin-left"></i>', '<i class="ion-ios-arrow-thin-right"></i>'],
    navSpeed: 2000,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: { 768: { items: 2 }, 1024: { items: 3 } },
});

$('#portfolio-slider4').owlCarousel({
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    navText: ['<i class="ion-ios-arrow-thin-left"></i>', '<i class="ion-ios-arrow-thin-right"></i>'],
    navSpeed: 2000,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: { 768: { items: 2 }, 1024: { items: 4 } },
});

$(window).on('load', function() {
    var $container = $('#portfolio-container');
    if (!$('body').hasClass('home-page')) {
        $container.isotope({
            masonry: { columnWidth: '.portfolio-item' },
            itemSelector: '.portfolio-item'
        });
        $('#filters').on('click', 'li', function() {
            $('#filters li').removeClass('active');
            $(this).addClass('active');
            var filterValue = $(this).attr('data-filter');
            $container.isotope({ filter: filterValue });
        });
    }
});

$(document).ready(function() {
    $('.portfolio-content .overlay-button').on('mouseenter focus', function() {
        $(this).closest('.portfolio-content').addClass('button-hover');
    }).on('mouseleave blur', function() {
        $(this).closest('.portfolio-content').removeClass('button-hover');
    });
});

$('.gallery').each(function() {
    $(this).magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: { enabled: true }
    });
});

$('.cs-image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-fade'
});

document.addEventListener("DOMContentLoaded", function() {
    const isHomePage = document.body.classList.contains('home-page');

    if (isHomePage) {
        const caseStudyContainer = document.querySelector('#work #portfolio-container');
        const caseStudyItems = Array.from(document.querySelectorAll('#work .portfolio-item'));
        const caseStudyCount = caseStudyItems.length;

        if (caseStudyContainer && caseStudyCount > 0) {
            caseStudyContainer.style.setProperty('--case-study-count', String(caseStudyCount));
        }

        caseStudyItems.forEach((item, index) => {
            item.classList.remove('scroll-in', 'scroll-in-left', 'scroll-in-right', 'scroll-in-up', 'show');
            item.style.setProperty('--case-study-index', String(index + 1));
            item.style.setProperty('--case-study-index0', String(index));
            item.style.setProperty('--case-study-reverse-index', String(caseStudyCount - index));
            item.style.setProperty('--case-study-reverse-index0', String((caseStudyCount - index) - 1));
            item.style.setProperty('--case-study-stack-z', String(index + 1));
        });
    }

    const scrollElements = document.querySelectorAll(".scroll-in");
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
    };
    
    const displayScrollElement = (element) => element.classList.add("show");
    const hideScrollElement = (element) => element.classList.remove("show");
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    handleScrollAnimation();
    window.addEventListener("scroll", handleScrollAnimation);

    const fullViewVideos = Array.from(
        document.querySelectorAll('video[data-play-when-full-view="true"]')
    );

    if (fullViewVideos.length) {
        const getVisibleRatio = (video) => {
            const rect = video.getBoundingClientRect();
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const visibleArea = visibleWidth * visibleHeight;
            const totalArea = rect.width * rect.height;

            return totalArea > 0 ? (visibleArea / totalArea) : 0;
        };

        const isVideoFullyInViewport = (video) => {
            const rect = video.getBoundingClientRect();
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const tolerance = 1;
            const fullyFitsViewport =
                rect.width <= viewportWidth + tolerance &&
                rect.height <= viewportHeight + tolerance;

            if (fullyFitsViewport) {
                return (
                    rect.top >= -tolerance &&
                    rect.left >= -tolerance &&
                    rect.bottom <= viewportHeight + tolerance &&
                    rect.right <= viewportWidth + tolerance
                );
            }

            const visibleRatio = getVisibleRatio(video);
            const maxVisibleArea = Math.min(rect.width, viewportWidth) * Math.min(rect.height, viewportHeight);
            const maxVisibleRatio = rect.width > 0 && rect.height > 0
                ? Math.min(1, maxVisibleArea / (rect.width * rect.height))
                : 0;
            const adaptiveThreshold = Math.max(0.72, maxVisibleRatio - 0.02);

            return (
                visibleRatio >= adaptiveThreshold &&
                rect.bottom > tolerance &&
                rect.top < (viewportHeight - tolerance)
            );
        };

        const syncVideoPlayback = (video) => {
            if (isVideoFullyInViewport(video)) {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {});
                }
            } else {
                video.pause();
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                syncVideoPlayback(entry.target);
            });
        }, {
            threshold: [0, 0.25, 0.5, 0.7, 0.85, 1]
        });

        fullViewVideos.forEach((video) => {
            video.pause();
            observer.observe(video);
            syncVideoPlayback(video);
        });

        const refreshPlayback = () => {
            fullViewVideos.forEach(syncVideoPlayback);
        };

        window.addEventListener("resize", refreshPlayback);
        window.addEventListener("scroll", refreshPlayback, { passive: true });
    }
});
