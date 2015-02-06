(function() {
  require.config({
    paths: {
      jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min'
    }
  });

  require(['jquery'], function($) {
    var isMobile, setOpacity, target;
    console.log('jquery loaded');
    new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: false,
      live: true
    }).init();
    $("a[href*=#]:not([href=#])").click(function() {
      var target;
      if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") || location.hostname === this.hostname) {
        target = $(this.hash);
        target = (target.length ? target : $("[name=" + this.hash.slice(1) + "]"));
        if (target.length) {
          $("html,body").animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
    if (Modernizr.csstransforms) {
      $("#welcome").addClass("centered");
    }
    isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true;
    }
    target = $("#welcome");
    setOpacity = function() {
      var fadeUntil, fromTop, height, offset, opacity;
      fromTop = $(window).scrollTop();
      target.css('margin-top', fromTop + 'px');
      offset = target.offset().top;
      height = target.outerHeight() / 4;
      fadeUntil = $('.hero').outerHeight() / 2;
      opacity = 0;
      if (fromTop <= height) {
        opacity = 1;
      } else if (fromTop <= fadeUntil) {
        opacity = 1 - fromTop / fadeUntil;
      }
      return target.css({
        'opacity': opacity
      });
    };
    if (!isMobile) {
      setOpacity();
      return $(window).scroll(function() {
        return setOpacity();
      });
    }
  });

}).call(this);
