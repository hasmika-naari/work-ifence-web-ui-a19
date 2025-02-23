(function($){
    "use strict";
    
    // Sticky Header
    $(window).on('scroll',function() {

        if ($(this).scrollTop() > 120){
            $('.crake-nav').addClass("is-sticky");
            $('.crake-nav-mobile').addClass("is-sticky");
            $('.deals-filter').addClass("is-filter-sticky");
            $('.logo-no-white').removeClass("display-none");
            $('.logo-no-white').addClass("display-block");
            $('.side-menu').removeClass("navbar-side-menu-button");
            $('.side-menu').addClass("navbar-side-menu-button-sticky");
            
            $('.logo-white').removeClass("display-block");
            $('.logo-white').addClass("display-none");
        }
        else{
            $('.crake-nav').removeClass("is-sticky");
            $('.crake-nav-mobile').removeClass("is-sticky");
            $('.deals-filter').removeClass("is-filter-sticky");

            $('.logo-no-white').addClass("display-none");
            $('.logo-no-white').removeClass("display-block");

            $('.logo-white').addClass("display-block");
            $('.logo-white').removeClass("display-none");

            $('.side-menu').removeClass("navbar-side-menu-button-sticky");
            $('.side-menu').addClass("navbar-side-menu-button");
        }
    });

    // Header Search
    $("#header-search-main").on("click", function (event) {
        event.preventDefault();
        $("#header-search").addClass("open");
        $('#header-search > form > input[type="search"]').focus();
    });
    $("#header-search, #header-search button.close").on("click", function (
        event
    ) {
        if (
            event.target === this ||
            event.target.className === "close" ||
            event.keyCode === 27
        ) {
            $(this).removeClass("open");
        }
    });

    // WOW JS
    debugger;
    // if ($(".wow").length) {
    //     debugger;
    //     var wow = new WOW({
    //     boxClass:     'wow',      // animated element css class (default is wow)
    //     animateClass: 'animated', // animation css class (default is animated)
    //     offset:       10,          // distance to the element when triggering the animation (default is 0)
    //     mobile:       true,       // trigger animations on mobile devices (default is true)
    //     live:         true,       // act on asynchronously loaded content (default is true)
    //     });
    //     wow.init();
    // }
    

    // Check distance to top and display back-to-top.
    $( window ).on('scroll', function() {
        if ( $( this ).scrollTop() > 800 ) {
            $( '.back-to-top' ).addClass( 'show-back-to-top' );
        } else {
            $( '.back-to-top' ).removeClass( 'show-back-to-top' );
        }
    });
    $('.back-to-top').on('click', function() {
        $("html, body").animate({ scrollTop: "0" },  500);
    });
        
}(jQuery));