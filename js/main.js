// ================================================
// CLEAN NAVIGATION JAVASCRIPT
// ================================================

$(document).ready(function() {
    "use strict";
    
    // Initialize
    initScrollEffects();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
});

// ================================================
// SCROLL EFFECTS
// ================================================
function initScrollEffects() {
    const header = $('#header');
    
    function updateHeaderState() {
        if ($(window).scrollTop() > 0) {
            header.addClass('is-scrolled');
        } else {
            header.removeClass('is-scrolled');
        }
    }
    
    updateHeaderState();
    $(window).on('scroll', updateHeaderState);
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
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.hash);
        
        if (target.length) {
            e.preventDefault();
            
            $('html, body').animate({
                scrollTop: target.offset().top - 75
            }, 600, 'swing');
            
            if (history.pushState) {
                history.pushState(null, null, this.hash);
            }
        }
    });
    
    $(window).on('scroll', updateActiveNavLinks);
    
    function updateActiveNavLinks() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('.nav-link').each(function() {
            const link = $(this);
            const href = link.attr('href');
            
            if (href && href.startsWith('#')) {
                const section = $(href);
                
                if (section.length) {
                    const sectionTop = section.offset().top;
                    const sectionBottom = sectionTop + section.outerHeight();
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        $('.nav-link').removeClass('active');
                        link.addClass('active');
                    }
                }
            }
        });
        
        if ($(window).scrollTop() < 50) {
            $('.nav-link').removeClass('active');
        }
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
});
