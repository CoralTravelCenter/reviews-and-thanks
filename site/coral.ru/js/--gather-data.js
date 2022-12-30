console.table($('p>strong').map(function (idx, el) {
    var $heading = $(el);
    var $body = $heading.closest('p').next('p');
    var $foot = $heading.closest('p').nextAll('p').filter(function (idx, el) {
        return $(el).find('>*').filter(function (idx, el) {
            return $(el).css('float') === 'right';
        }).length;
    }).eq(0);
    return {
        heading: $heading.html(),
        body: $body.html(),
        author: $foot.find('em').html(),
        date: moment($foot.find('>*:not(em)').text(), 'D.M.Y').format('DD.MM.YYYY')
    }
}).toArray());
