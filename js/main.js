$(document).ready(function() {

    "use strict";

    HideShowHeader();
    HeroSection()
    BackToTop();

});


//Owl Carousel
$('#hero-slider').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    navText: [
        '<i class="ion-ios-arrow-thin-left"></i>',
        '<i class="ion-ios-arrow-thin-right"></i>'
    ],
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
    navText: [
        '<i class="ion-ios-arrow-thin-left"></i>',
        '<i class="ion-ios-arrow-thin-right"></i>'
    ],
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive : {
        // breakpoint from 480 up
        1024 : {
            items: 2,
        },
    },
});

$('#portfolio-slider2').owlCarousel({
    items: 1,
    loop: true,
    margin: 30,
    nav: true,
    navText: [
        '<i class="ion-ios-arrow-thin-left"></i>',
        '<i class="ion-ios-arrow-thin-right"></i>'
    ],
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
    navText: [
        '<i class="ion-ios-arrow-thin-left"></i>',
        '<i class="ion-ios-arrow-thin-right"></i>'
    ],
    navSpeed: 2000,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive : {
        // breakpoint from 480 up
        768 : {
            items: 2,
        },
        1024 : {
            items: 3,
        },
    },
});

$('#portfolio-slider4').owlCarousel({
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    navText: [
        '<i class="ion-ios-arrow-thin-left"></i>',
        '<i class="ion-ios-arrow-thin-right"></i>'
    ],
    navSpeed: 2000,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive : {
        // breakpoint from 480 up
        768 : {
            items: 2,
        },
        1024 : {
            items: 4,
        },
    },
});



//Flexnav Menu
$(".flexnav").flexNav({ 'animationSpeed': 0 });

$(window).on('load', function() {
    //Portfolio masonry
    var $container = $('#portfolio-container');
    $container.isotope({
        masonry: {
            columnWidth: '.portfolio-item'
        },
        itemSelector: '.portfolio-item'
    });
    $('#filters').on('click', 'li', function() {
        $('#filters li').removeClass('active');
        $(this).addClass('active');
        var filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });
    });
});

$('.menu-button').on('click', function() {
    $('.menu-button').toggleClass('menu-open menu-close');
});

if(screen.width<1024) {
    $('.menubar .flexnav').removeClass('flexnav-show');
}


//Hide Show Header on Scroll
function HideShowHeader() {

    var didScroll;
    var lastScrollTop = 0;
    var delta = 50;
    var navbarHeight = 75;
    var navbarHideAfter = navbarHeight

    $(window).scroll(function(event) {
        didScroll = true;
    });

    if ($('.scroll-hide').length > 0) {

        setInterval(function() {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 100);

    }

    return false;

    function hasScrolled() {
        var st = $(this).scrollTop();

        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        if (st > lastScrollTop && st > navbarHideAfter) {
            if ($('.scroll-hide').length > 0) {
                $('header').addClass('hide');
            }
        } else {
            if ($('.scroll-hide').length > 0) {
                if (st + $(window).height() < $(document).height()) {
                    $('header').removeClass('hide');
                    $('#header.transparent').addClass('white-bg');
                }
            }

            if ($(window).scrollTop() < 300) {
                $('#header.transparent').removeClass('white-bg');
            }
        }

        lastScrollTop = st;

    }

}

//Hero Section
function HeroSection() {

    var Hero = document.getElementById('hero');
    var windowScrolled;


    window.addEventListener('scroll', function windowScroll() {
        windowScrolled = window.pageYOffset || document.documentElement.scrollTop;

        Hero.style.opacity = (1 - (windowScrolled / 20) / 20);

    });

}

//Magnific Pop Up
$('.gallery').each(function() { // the containers for all your galleries
    $(this).magnificPopup({
        delegate: 'a', // the selector for gallery item
        type: 'image',
        gallery: {
            enabled: true
        }
    });
});

//Back To Top
function BackToTop() {

    $('.scrolltotop').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    $(document).scroll(function() {
        var y = $(this).scrollTop();
        if (y > 600) {
            $('.scrolltotop').fadeIn();
        } else {
            $('.scrolltotop').fadeOut();
        }
    });

}

$('.view-map').on('click', function() {

    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 700);
            return false;
        }
    }
})


//Scroll To
$(document).ready(function () {
    $(document).on("scroll", onScroll);
    
    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        
        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
      
        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});

// Portfolio image zoom only on button hover
$(document).ready(function () {
    $('.portfolio-content .overlay-button').on('mouseenter focus', function () {
        $(this).closest('.portfolio-content').addClass('button-hover');
    }).on('mouseleave blur', function () {
        $(this).closest('.portfolio-content').removeClass('button-hover');
    });
});

// Image popups for case study thumbnails
$(document).ready(function () {
    if ($.fn.magnificPopup) {
        $('.cs-image-popup').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-fade'
        });
    }
});



function onScroll(event){
    var scrollPos = $(document).scrollTop();
    // Do not mark any nav link active until the user has scrolled a bit
    if (scrollPos < 50) {
        $('#menu-center ul li a').removeClass("active");
        return;
    }
    $('#menu-center a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#menu-center ul li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}



//Fade in on Scroll
document.addEventListener("DOMContentLoaded", function() {
    const scrollElements = document.querySelectorAll(".scroll-in");

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("show");
    };

    const hideScrollElement = (element) => {
        element.classList.remove("show");
    };

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

    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });
});
