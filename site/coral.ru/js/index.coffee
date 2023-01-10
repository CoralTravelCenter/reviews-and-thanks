window.ASAP = (->
    fns = []
    callall = () ->
        f() while f = fns.shift()
    if document.addEventListener
        document.addEventListener 'DOMContentLoaded', callall, false
        window.addEventListener 'load', callall, false
    else if document.attachEvent
        document.attachEvent 'onreadystatechange', callall
        window.attachEvent 'onload', callall
    (fn) ->
        fns.push fn
        callall() if document.readyState is 'complete'
)()

log = () ->
    if window.console and window.DEBUG
        console.group? window.DEBUG
        if arguments.length == 1 and Array.isArray(arguments[0]) and console.table
            console.table.apply window, arguments
        else
            console.log.apply window, arguments
        console.groupEnd?()
trouble = () ->
    if window.console
        console.group? window.DEBUG if window.DEBUG
        console.warn?.apply window, arguments
        console.groupEnd?() if window.DEBUG

window.preload = (what, fn) ->
    what = [what] unless  Array.isArray(what)
    $.when.apply($, ($.ajax(lib, dataType: 'script', cache: true) for lib in what)).done -> fn?()


#window.DEBUG = 'APP NAME'

ASAP ->
    libs = [
        'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/1.5.5/perfect-scrollbar.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js'
    ]
    $libsReady = $.Deferred()
    preload libs, -> $libsReady.resolve()

    $(document).on 'click', '.leftSiblingMenu .slide.plus', () -> $(this).toggleClass('open')

    $all_reviews = $('.all-reviews')
    $all_reviews.html $('script[type="all/reviews"]').html()
    $reviews = $all_reviews.children()
    years = {}
    $reviews.each (idx, el) ->
        $el = $(el)
        y = moment($el.find('.date').text(), 'DD.MM.YYYY').year()
        years[y] = yes
        $el.attr 'data-year', y
    years_nav = Object.keys(years).sort().reverse()
    $('.annual-nav').html years_nav.map((y) -> "<button data-nav-year='#{y}'>#{y}</button>")
    $reviews.slice(0, 5).addClass('shown')

    o = new IntersectionObserver (entries, observer) ->
        for entry in entries
            if entry.isIntersecting
                observer.unobserve entry.target
                $next = $(entry.target).next()
                if $next.get(0)
                    $next.show()
                    setTimeout ->
                        $next.addClass('shown')
                    , 250
                    observer.observe $next.get(0)
    , threshold: .5
    o.observe $('.review-block.shown:last').get(0)

    $.when($libsReady).done ->
        $(document).on 'click', '[data-nav-year]', (e) ->
            y = $(this).attr('data-nav-year')
            $anchor = $("[data-year=#{y}]").eq(0)
            $anchor.addClass('shown').prevAll().addClass('shown')
            setTimeout ->
                o.observe $('.review-block.shown:last').get(0)
                $(window).scrollTo $anchor, 500, offset: -200
            , 100

