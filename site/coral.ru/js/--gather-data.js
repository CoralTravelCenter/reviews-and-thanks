var reviews = $('p>strong').filter(function (idx, el) {
    return $(el).siblings().length === 0;
}).map(function (idx, el) {
    var $heading = $(el);
    var $body = $heading.closest('p').next('p');
    var $foot = $heading.closest('p').nextAll('p').filter(function (idx, el) {
        return $(el).find('>*').filter(function (idx, el) {
            return $(el).css('float') === 'right';
        }).length;
    }).eq(0);
    return {
        heading: $heading.html(),
        body:    $body.html().replace(/https?:\/\/agency/g, m => m.replace('agency', 'oldagency')),
        author:  $foot.find('em').html()?.replace(/^\s*<br>/, ''),
        date:    moment($foot.find('>*:not(em)').text(), 'D.M.Y').format('DD.MM.YYYY')
    }
}).toArray();
reviews.map(review => {
    return `
<div class="review-block">
    <div class="head-body">
        <h4>${ review.heading }</h4>
        <div class="body">${ review.body }</div>
    </div>
    <div class="foot">
        <div class="author">${ review.author || '' }</div>
        <div class="date">${ review.date }</div>
    </div>
</div>    
    `;
}).join("");