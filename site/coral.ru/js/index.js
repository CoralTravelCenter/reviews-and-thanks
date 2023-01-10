var log, trouble;

window.ASAP = (function() {
  var callall, fns;
  fns = [];
  callall = function() {
    var f, results;
    results = [];
    while (f = fns.shift()) {
      results.push(f());
    }
    return results;
  };
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callall, false);
    window.addEventListener('load', callall, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', callall);
    window.attachEvent('onload', callall);
  }
  return function(fn) {
    fns.push(fn);
    if (document.readyState === 'complete') {
      return callall();
    }
  };
})();

log = function() {
  if (window.console && window.DEBUG) {
    if (typeof console.group === "function") {
      console.group(window.DEBUG);
    }
    if (arguments.length === 1 && Array.isArray(arguments[0]) && console.table) {
      console.table.apply(window, arguments);
    } else {
      console.log.apply(window, arguments);
    }
    return typeof console.groupEnd === "function" ? console.groupEnd() : void 0;
  }
};

trouble = function() {
  var ref;
  if (window.console) {
    if (window.DEBUG) {
      if (typeof console.group === "function") {
        console.group(window.DEBUG);
      }
    }
    if ((ref = console.warn) != null) {
      ref.apply(window, arguments);
    }
    if (window.DEBUG) {
      return typeof console.groupEnd === "function" ? console.groupEnd() : void 0;
    }
  }
};

window.preload = function(what, fn) {
  var lib;
  if (!Array.isArray(what)) {
    what = [what];
  }
  return $.when.apply($, (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = what.length; i < len; i++) {
      lib = what[i];
      results.push($.ajax(lib, {
        dataType: 'script',
        cache: true
      }));
    }
    return results;
  })()).done(function() {
    return typeof fn === "function" ? fn() : void 0;
  });
};

ASAP(function() {
  var $all_reviews, $libsReady, $reviews, libs, o, years, years_nav;
  libs = ['https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/1.5.5/perfect-scrollbar.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js'];
  $libsReady = $.Deferred();
  preload(libs, function() {
    return $libsReady.resolve();
  });
  $(document).on('click', '.leftSiblingMenu .slide.plus', function() {
    return $(this).toggleClass('open');
  });
  $all_reviews = $('.all-reviews');
  $all_reviews.html($('script[type="all/reviews"]').html());
  $reviews = $all_reviews.children();
  years = {};
  $reviews.each(function(idx, el) {
    var $el, y;
    $el = $(el);
    y = moment($el.find('.date').text(), 'DD.MM.YYYY').year();
    years[y] = true;
    return $el.attr('data-year', y);
  });
  years_nav = Object.keys(years).sort().reverse();
  $('.annual-nav').html(years_nav.map(function(y) {
    return "<button data-nav-year='" + y + "'>" + y + "</button>";
  }));
  $reviews.slice(0, 5).addClass('shown');
  o = new IntersectionObserver(function(entries, observer) {
    var $next, entry, i, len, results;
    results = [];
    for (i = 0, len = entries.length; i < len; i++) {
      entry = entries[i];
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        $next = $(entry.target).next();
        if ($next.get(0)) {
          $next.show();
          setTimeout(function() {
            return $next.addClass('shown');
          }, 250);
          results.push(observer.observe($next.get(0)));
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  }, {
    threshold: .5
  });
  o.observe($('.review-block.shown:last').get(0));
  return $.when($libsReady).done(function() {
    return $(document).on('click', '[data-nav-year]', function(e) {
      var $anchor, y;
      y = $(this).attr('data-nav-year');
      $anchor = $("[data-year=" + y + "]").eq(0);
      $anchor.addClass('shown').prevAll().addClass('shown');
      return setTimeout(function() {
        o.observe($('.review-block.shown:last').get(0));
        return $(window).scrollTo($anchor, 500, {
          offset: -200
        });
      }, 100);
    });
  });
});
