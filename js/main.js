// ================================================
// CLEAN NAVIGATION JAVASCRIPT
// ================================================

$(document).ready(function() {
    "use strict";
    
    // Initialize
    initFlexNav();
    initScrollEffects();
    initMobileMenu();
    initDesktopNavPill();
    initHomePageAboutView();
    initSmoothScroll();
    initHeroVideoModal();
    initHeroInterestPreviews();
});

// ================================================
// FLEXNAV (HAMBURGER MENU)
// ================================================
function initFlexNav() {
    const menuButton = $('#menu-center .menu-button');
    const nav = $('.flexnav.standard');
    if (!menuButton.length || !nav.length) return;

    function setMenuState(isMenuOpen) {
        nav.toggleClass('flexnav-show', isMenuOpen);
        menuButton.toggleClass('menu-open', !isMenuOpen);
        menuButton.toggleClass('menu-close', isMenuOpen);
        menuButton.attr('aria-expanded', isMenuOpen ? 'true' : 'false');
    }

    menuButton.off('click.flexnav').on('click.flexnav', function(event) {
        if (window.innerWidth > 1024) return;
        event.preventDefault();
        event.stopPropagation();
        setMenuState(!nav.hasClass('flexnav-show'));
    });

    nav.find('a').off('click.flexnav').on('click.flexnav', function() {
        if (window.innerWidth > 1024) return;
        setMenuState(false);
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

function initDesktopNavPill() {
    const nav = document.querySelector('.nav-desktop-links');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('.nav-primary-link'));
    if (!links.length) return;

    let highlight = nav.querySelector('.nav-desktop-highlight');
    if (!highlight) {
        highlight = document.createElement('span');
        highlight.className = 'nav-desktop-highlight';
        highlight.setAttribute('aria-hidden', 'true');
        nav.prepend(highlight);
    }

    let hoveredLink = null;
    let resetTransitionTimer = null;
    const desktopMedia = window.matchMedia('(min-width: 1025px)');

    function getActiveLink() {
        return links.find((link) => link.classList.contains('active')) || links[0];
    }

    function setInstantTransition(disabled) {
        window.clearTimeout(resetTransitionTimer);
        highlight.classList.toggle('is-no-transition', disabled);

        if (disabled) {
            resetTransitionTimer = window.setTimeout(() => {
                highlight.classList.remove('is-no-transition');
            }, 40);
        }
    }

    function positionHighlight(target, instant = false) {
        if (!desktopMedia.matches || !target) {
            nav.classList.remove('has-highlight');
            return;
        }

        const navRect = nav.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        setInstantTransition(instant);
        highlight.style.width = `${targetRect.width}px`;
        highlight.style.height = `${targetRect.height}px`;
        highlight.style.transform = `translate(${targetRect.left - navRect.left}px, ${targetRect.top - navRect.top}px)`;
        nav.classList.add('has-highlight');
    }

    function updateHighlight(instant = false) {
        if (!desktopMedia.matches) {
            nav.classList.remove('has-highlight', 'is-hovering');
            hoveredLink = null;
            return;
        }

        positionHighlight(hoveredLink || getActiveLink(), instant);
    }

    function clearHoverState() {
        hoveredLink = null;
        nav.classList.remove('is-hovering');
        updateHighlight();
    }

    links.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            hoveredLink = link;
            nav.classList.add('is-hovering');
            updateHighlight();
        });

        link.addEventListener('focus', () => {
            hoveredLink = link;
            nav.classList.add('is-hovering');
            updateHighlight();
        });
    });

    nav.addEventListener('mouseleave', clearHoverState);
    nav.addEventListener('focusout', () => {
        window.setTimeout(() => {
            if (!nav.contains(document.activeElement)) {
                clearHoverState();
            }
        }, 0);
    });

    const observer = new MutationObserver(() => {
        updateHighlight(true);
    });

    links.forEach((link) => {
        observer.observe(link, { attributes: true, attributeFilter: ['class'] });
    });

    desktopMedia.addEventListener('change', () => {
        updateHighlight(true);
    });

    window.addEventListener('resize', () => {
        updateHighlight(true);
    });

    window.addEventListener('load', () => {
        updateHighlight(true);
    });

    updateHighlight(true);
}

function initHomePageAboutView() {
    const body = $('body.home-page');
    const aboutView = $('[data-home-page-about-view]');
    const defaultSections = $('[data-home-page-default-only]');
    const aboutTriggers = $('[data-home-page-view-trigger="about"]');
    const restoreTargets = $('.nav-home-link, a[href="#work"], a[href="#contact"]');

    if (!body.length || !aboutView.length) return;

    function setDefaultVisibility(showDefault) {
        defaultSections.each(function() {
            $(this).prop('hidden', !showDefault);
        });

        aboutView.prop('hidden', showDefault).attr('aria-hidden', showDefault ? 'true' : 'false');
        body.toggleClass('home-about-view-active', !showDefault);
    }

    function setAboutActiveState() {
        const navLinks = $('.nav-desktop-links .nav-primary-link, #menu-center .flexnav.standard > li > .nav-primary-link');

        navLinks.removeClass('active');

        if (body.hasClass('home-about-view-active')) {
            navLinks.filter('[data-home-page-view-trigger="about"]').addClass('active');
        }
    }

    function scrollToHash(hash) {
        const target = $(hash);

        if (!target.length) return;

        $('html, body').stop(true).animate({
            scrollTop: hash === '#top' ? 0 : target.offset().top - 75
        }, 600, 'swing');
    }

    function showAboutView(updateHistory) {
        setDefaultVisibility(false);
        setAboutActiveState();
        $('html, body').scrollTop(0);

        if (updateHistory && history.pushState) {
            history.pushState(null, null, '#about');
        }
    }

    function showDefaultView(hash, updateHistory) {
        setDefaultVisibility(true);
        setAboutActiveState();

        if (hash) {
            scrollToHash(hash);
        }

        if (updateHistory && history.pushState) {
            history.pushState(null, null, hash || '#top');
        }
    }

    function syncViewToHash() {
        const hash = window.location.hash;

        if (hash === '#about') {
            showAboutView(false);
            return;
        }

        setDefaultVisibility(true);
        setAboutActiveState();
    }

    aboutTriggers.off('click.homeAboutView').on('click.homeAboutView', function(event) {
        event.preventDefault();
        showAboutView(true);
    });

    restoreTargets.off('click.homeAboutView').on('click.homeAboutView', function(event) {
        const hash = $(this).attr('href');

        if (!body.hasClass('home-about-view-active') || !hash || !hash.startsWith('#')) {
            return;
        }

        event.preventDefault();
        showDefaultView(hash, true);
    });

    $(window).off('hashchange.homeAboutView').on('hashchange.homeAboutView', syncViewToHash);
    window.addEventListener('popstate', syncViewToHash);
    syncViewToHash();
}

function initSmoothScroll() {
    const navLinks = $('.nav-desktop-links .nav-primary-link, #menu-center .flexnav.standard > li > .nav-primary-link');
    const sectionLinks = navLinks.filter(function() {
        const href = $(this).attr('href');
        return href && href.startsWith('#') && !$(this).is('[data-home-page-view-trigger]');
    });

    $('a[href^="#"]').not('[data-home-page-view-trigger]').on('click', function(e) {
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
        if ($('body').hasClass('home-about-view-active')) {
            return;
        }

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
// HERO INTRO VIDEO MODAL
// ================================================
function initHeroVideoModal() {
    const modal = document.querySelector('#hero-intro-video-modal');
    const triggers = Array.from(document.querySelectorAll('.hero-case-video-trigger'));

    if (!modal || !triggers.length) {
        return;
    }

    const video = modal.querySelector('.hero-video-modal-player');
    const closeButton = modal.querySelector('.hero-video-modal-close');
    const closeTargets = Array.from(modal.querySelectorAll('[data-hero-video-close]'));
    let closeTimer;
    let activeTrigger = null;

    function openModal(trigger) {
        activeTrigger = trigger;
        window.clearTimeout(closeTimer);
        modal.hidden = false;
        document.body.classList.add('hero-video-modal-open');

        window.requestAnimationFrame(() => {
            modal.classList.add('is-open');
        });

        if (closeButton) {
            closeButton.focus();
        }

        if (video) {
            const playPromise = video.play();
            if (playPromise) {
                playPromise.catch(() => {});
            }
        }
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.classList.remove('hero-video-modal-open');

        if (video) {
            video.pause();
        }

        closeTimer = window.setTimeout(() => {
            modal.hidden = true;
        }, 240);

        if (activeTrigger) {
            activeTrigger.focus();
        }
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => openModal(trigger));
    });

    closeTargets.forEach((target) => {
        target.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
}

// ================================================
// HERO INTEREST PREVIEWS
// ================================================
function initHeroInterestPreviews() {
    const chips = Array.from(document.querySelectorAll('[data-interest-preview]'));
    const preview = document.querySelector('.hero-interest-preview');
    const desktopMediaQuery = window.matchMedia('(min-width: 1025px)');

    if (!chips.length || !preview) {
        return;
    }

    const previewIcon = preview.querySelector('.hero-interest-preview-media i');
    const previewTitle = preview.querySelector('.hero-interest-preview-copy strong');
    const previewCopy = preview.querySelector('.hero-interest-preview-copy span');
    const edgeInset = 16;
    const previewGap = 12;

    function setPreviewContent(chip) {
        const previewType = chip.dataset.interestPreview;

        preview.dataset.previewActive = previewType;
        previewTitle.textContent = chip.dataset.previewTitle || '';
        previewCopy.textContent = chip.dataset.previewCopy || '';
        previewIcon.className = previewType === 'fishing'
            ? 'fa-solid fa-water'
            : 'fa-brands fa-500px';
    }

    function positionPreview(chip, clientX) {
        const chipRect = chip.getBoundingClientRect();
        const previewRect = preview.getBoundingClientRect();
        const maxX = window.innerWidth - previewRect.width - edgeInset;
        const x = Math.min(Math.max(edgeInset, clientX - (previewRect.width / 2)), maxX);
        const y = Math.max(edgeInset, chipRect.top - previewRect.height - previewGap);

        preview.style.setProperty('--interest-preview-x', `${x}px`);
        preview.style.setProperty('--interest-preview-y', `${y}px`);
    }

    function showPreview(chip, clientX) {
        if (!desktopMediaQuery.matches) {
            hidePreview();
            return;
        }

        setPreviewContent(chip);
        positionPreview(chip, clientX);
        preview.classList.add('is-visible');
    }

    function hidePreview() {
        preview.classList.remove('is-visible');
    }

    chips.forEach((chip) => {
        chip.addEventListener('mouseenter', (event) => {
            showPreview(chip, event.clientX);
        });

        chip.addEventListener('mousemove', (event) => {
            positionPreview(chip, event.clientX);
        });

        chip.addEventListener('mouseleave', hidePreview);

        chip.addEventListener('focus', () => {
            const rect = chip.getBoundingClientRect();
            showPreview(chip, rect.left + (rect.width / 2));
        });

        chip.addEventListener('blur', hidePreview);
    });

    desktopMediaQuery.addEventListener('change', (event) => {
        if (!event.matches) {
            hidePreview();
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

const portfolioVideoManager = (() => {
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const managedVideos = new WeakSet();
    const lazyLoadRootMargin = '300px 0px';
    const autoplayVisibilityThreshold = 0.35;

    function isNearViewport(element) {
        if (!element) {
            return false;
        }

        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        return rect.top <= viewportHeight + 300 && rect.bottom >= -300;
    }

    function getLazySources(video) {
        return Array.from(video.querySelectorAll('source[data-src]'));
    }

    function hydrateVideo(video) {
        if (!video || video.dataset.lazyHydrated === 'true') {
            return;
        }

        let assignedSource = false;
        const deferredSrc = video.dataset.deferredSrc;

        if (deferredSrc && video.getAttribute('src') !== deferredSrc) {
            video.setAttribute('src', deferredSrc);
            assignedSource = true;
        }

        getLazySources(video).forEach((source) => {
            const src = source.dataset.src;

            if (src && source.getAttribute('src') !== src) {
                source.setAttribute('src', src);
                assignedSource = true;
            }
        });

        if (assignedSource) {
            video.load();
        }

        if (deferredSrc || getLazySources(video).length) {
            video.dataset.lazyHydrated = 'true';
        }
    }

    function playVideo(video) {
        if (!video) {
            return;
        }

        hydrateVideo(video);

        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    }

    function pauseVideo(video) {
        if (!video) {
            return;
        }

        video.pause();
    }

    function resetDeferredSource(video, src) {
        if (!video || !src) {
            return;
        }

        const currentDeferredSrc = video.dataset.deferredSrc || '';
        if (currentDeferredSrc === src && video.dataset.lazyHydrated !== 'false') {
            return;
        }

        pauseVideo(video);
        video.dataset.deferredSrc = src;
        video.dataset.lazyHydrated = 'false';

        if (video.hasAttribute('src')) {
            video.removeAttribute('src');
        }

        video.querySelectorAll('source').forEach((source, index) => {
            source.removeAttribute('src');

            if (index === 0) {
                source.dataset.src = src;
            } else {
                delete source.dataset.src;
            }
        });

        video.load();

        if (!supportsIntersectionObserver || isNearViewport(video)) {
            hydrateVideo(video);
        }
    }

    const lazyLoadObserver = supportsIntersectionObserver
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                hydrateVideo(entry.target);
                lazyLoadObserver.unobserve(entry.target);
            });
        }, { rootMargin: lazyLoadRootMargin })
        : null;

    const autoplayVisibilityObserver = supportsIntersectionObserver
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;

                if (!video || video.dataset.autoplayWhenVisible !== 'true') {
                    return;
                }

                if (entry.isIntersecting) {
                    playVideo(video);
                } else {
                    pauseVideo(video);
                }
            });
        }, { threshold: autoplayVisibilityThreshold })
        : null;

    function registerVideo(video) {
        if (!video || managedVideos.has(video)) {
            return;
        }

        managedVideos.add(video);

        if (video.dataset.lazyVideo === 'true') {
            video.dataset.lazyHydrated = video.dataset.lazyHydrated || 'false';
        }

        if (!supportsIntersectionObserver) {
            if (video.dataset.lazyVideo === 'true') {
                hydrateVideo(video);
            }

            if (video.dataset.autoplayWhenVisible === 'true') {
                playVideo(video);
            }
            return;
        }

        if (video.dataset.lazyVideo === 'true' && lazyLoadObserver) {
            lazyLoadObserver.observe(video);
        }

        if (video.dataset.autoplayWhenVisible === 'true' && autoplayVisibilityObserver) {
            autoplayVisibilityObserver.observe(video);
        }
    }

    function init(root = document) {
        root
            .querySelectorAll('video[data-lazy-video="true"], video[data-autoplay-when-visible="true"]')
            .forEach(registerVideo);
    }

    return {
        init,
        isNearViewport,
        pauseVideo,
        playVideo,
        registerVideo,
        resetDeferredSource,
    };
})();

window.portfolioVideoManager = portfolioVideoManager;

document.addEventListener("DOMContentLoaded", function() {
    portfolioVideoManager.init();

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
        const fullViewVisibilityThreshold = 0.45;

        const getElementViewportRatio = (element) => {
            if (!element) {
                return 0;
            }

            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const visibleArea = visibleWidth * visibleHeight;
            const totalArea = Math.max(rect.width * rect.height, 1);

            return visibleArea / totalArea;
        };

        const resetFullViewVideo = (video) => {
            if (!video) {
                return;
            }

            video.dataset.fullViewStarted = 'false';
            video.dataset.buttonHoverPaused = 'false';
            portfolioVideoManager.pauseVideo(video);

            if (video.readyState >= 1) {
                video.currentTime = 0;
            }
        };

        const fullViewVideoItems = fullViewVideos.map((video) => {
            video.muted = true;
            video.loop = true;
            video.autoplay = false;
            video.dataset.buttonHoverPaused = 'false';
            video.dataset.fullViewStarted = 'false';
            video.pause();

            return {
                video,
                content: video.closest('.portfolio-content'),
                button: video.closest('.portfolio-content')?.querySelector('.overlay-button') || null,
            };
        });

        const syncActiveFullViewVideo = () => {
            let activeItem = null;
            let highestVisibilityRatio = 0;

            fullViewVideoItems.forEach((item) => {
                const visibilityRatio = getElementViewportRatio(item.content);

                if (visibilityRatio > highestVisibilityRatio) {
                    highestVisibilityRatio = visibilityRatio;
                    activeItem = item;
                }
            });

            fullViewVideoItems.forEach((item) => {
                if (
                    !item.content ||
                    item !== activeItem ||
                    highestVisibilityRatio < fullViewVisibilityThreshold
                ) {
                    resetFullViewVideo(item.video);
                    return;
                }

                if (item.video.dataset.fullViewStarted !== 'true') {
                    item.video.dataset.fullViewStarted = 'true';
                }

                if (item.video.dataset.buttonHoverPaused === 'true') {
                    portfolioVideoManager.pauseVideo(item.video);
                    return;
                }

                portfolioVideoManager.playVideo(item.video);
            });
        };

        let fullViewVideosTicking = false;
        const syncFullViewVideos = () => {
            syncActiveFullViewVideo();
            fullViewVideosTicking = false;
        };

        const requestFullViewVideoSync = () => {
            if (fullViewVideosTicking) {
                return;
            }

            fullViewVideosTicking = true;
            window.requestAnimationFrame(syncFullViewVideos);
        };

        fullViewVideoItems.forEach(({ video, content, button }) => {
            video.addEventListener('loadeddata', requestFullViewVideoSync);

            if (!content || !button) {
                return;
            }

            const syncButtonHoverPlayback = (clientX, clientY) => {
                const buttonRect = button.getBoundingClientRect();
                const isOverButton =
                    clientX >= buttonRect.left &&
                    clientX <= buttonRect.right &&
                    clientY >= buttonRect.top &&
                    clientY <= buttonRect.bottom;

                if (isOverButton) {
                    if (video.dataset.buttonHoverPaused !== 'true') {
                        video.dataset.buttonHoverPaused = 'true';
                        video.pause();
                    }
                    return;
                }

                if (video.dataset.buttonHoverPaused === 'true') {
                    video.dataset.buttonHoverPaused = 'false';
                    requestFullViewVideoSync();
                }
            };

            content.addEventListener('mousemove', (event) => {
                syncButtonHoverPlayback(event.clientX, event.clientY);
            });

            content.addEventListener('mouseleave', () => {
                if (video.dataset.buttonHoverPaused === 'true') {
                    video.dataset.buttonHoverPaused = 'false';
                    requestFullViewVideoSync();
                }
            });
        });

        requestFullViewVideoSync();
        window.addEventListener('scroll', requestFullViewVideoSync, { passive: true });
        window.addEventListener('resize', requestFullViewVideoSync);
    }

    initKpiPerformanceCharts();
});

function initKpiPerformanceCharts() {
    const charts = Array.from(document.querySelectorAll('.kpi-performance-chart'));
    if (!charts.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    charts.forEach((chart) => {
        const bars = Array.from(chart.querySelectorAll('.kpi-bar[data-kpi-value]'));
        if (!bars.length) {
            return;
        }

        const values = bars
            .map((bar) => Number.parseFloat(bar.dataset.kpiValue))
            .filter((value) => Number.isFinite(value));

        const maxValue = Math.max(...values.map((value) => Math.abs(value)), 1);

        bars.forEach((bar) => {
            const value = Number.parseFloat(bar.dataset.kpiValue);
            if (!Number.isFinite(value)) {
                bar.style.setProperty('--bar-scale', '0');
                return;
            }

            const scale = Math.min(1, Math.abs(value) / maxValue);
            const formattedValue = `${value > 0 ? '+' : ''}${value}%`;
            const valueLabel = bar.querySelector('.kpi-bar-value');

            bar.dataset.kpiDirection = value < 0 ? 'negative' : 'positive';
            bar.setAttribute('aria-label', `${formattedValue} ${value < 0 ? 'decrease' : 'increase'}`);
            bar.dataset.kpiScale = String(scale);
            bar.style.setProperty('--bar-scale', prefersReducedMotion ? String(scale) : '0');

            if (valueLabel) {
                valueLabel.textContent = formattedValue;
            }
        });

        if (prefersReducedMotion) {
            return;
        }

        const animateBars = () => {
            bars.forEach((bar, index) => {
                const scale = Number.parseFloat(bar.dataset.kpiScale || '0');
                if (!Number.isFinite(scale)) {
                    return;
                }

                window.setTimeout(() => {
                    bar.style.setProperty('--bar-scale', String(scale));
                }, index * 120);
            });
        };

        let hasAnimated = false;
        const triggerBars = () => {
            if (hasAnimated) {
                return;
            }
            hasAnimated = true;
            window.requestAnimationFrame(animateBars);
        };

        if (!('IntersectionObserver' in window)) {
            triggerBars();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                triggerBars();
                observer.disconnect();
            });
        }, {
            threshold: 0.35,
            rootMargin: '0px 0px -8% 0px'
        });

        observer.observe(chart);
    });
}
