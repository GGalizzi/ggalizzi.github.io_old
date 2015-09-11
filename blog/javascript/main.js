$(document).ready(function() {

  var header = document.querySelector('.header');
  var origOffsetY = header.offsetTop;

  function scroll() {
    var scrollPercentage = $(document).scrollTop() * 100 / $(document).height()
    if (scrollPercentage >= 5) {
      $('.header').addClass('transparent');
    } else {
      $('.header').removeClass('transparent');
    }
  }

  document.onscroll = scroll;
});
