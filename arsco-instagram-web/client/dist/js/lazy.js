function lazy() {
  var lazyImages = [].slice.call(document.querySelectorAll('.lazy'));
  var lazyloadThrottleTimeout;
  var lazyloadImages;
  var lazyload;
  lazyloadImages = document.querySelectorAll('.lazy');
  lazyload = function() {
    if (lazyloadThrottleTimeout) {
      clearTimeout(lazyloadThrottleTimeout);
    }
    lazyloadThrottleTimeout = setTimeout(function() {
      var scrollTop = window.pageYOffset;
      lazyloadImages.forEach(function(img) {
        if ($(img).offset().top < window.innerHeight + scrollTop) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
        }
      });
      if (lazyloadImages.length == 0) {
        document.removeEventListener('scroll', lazyload);
        window.removeEventListener('resize', lazyload);
        window.removeEventListener('orientationChange', lazyload);
      }
    }, 20);
  };

  document.removeEventListener('scroll', lazyload);
  window.removeEventListener('resize', lazyload);
  window.removeEventListener('orientationChange', lazyload);
  document.addEventListener('scroll', lazyload);
  window.addEventListener('resize', lazyload);
  window.addEventListener('orientationChange', lazyload);
  lazyload();
}

export default lazy;
