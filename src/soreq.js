const request = require('request')
const zlib = require('zlib');
const querystring = require('querystring');
const soreq = require("./soreq");

const ANSWERED_COLOUR = '#4CAF50';
const UNANSWERED_COLOUR = '#CDDC39';

module.exports = (res,search,page) => {
  function getGZipped(req, callback) {
    var gunzip = zlib.createGunzip();
    req.pipe(gunzip);

    var buffer  = [];
    gunzip.on('data', function (data) {
        buffer.push(data);
    }).on('end', function () {
        callback(null, JSON.parse(buffer.join('')));
    }).on('error', function (e) {
        callback(e);
    });
  }
  const url = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&q='+search+'&site=stackoverflow&page='+page.toString();
  console.log(url);
  const req = request({
    url: url,
    method: 'GET',
    resolveWithFullResponse: true
  })

  getGZipped(req,function(e,data){
    var questionsFound = [];
    var answered = false;
    var firstunfound = true;
    var title = '';
    var link = '';
    var itemToCarry;

    for (var i = 0, len = data.items.length; i < len; i++) {
        item = data.items[i];
        answered = item.is_answered;
        title = item.title;
        link = item.link;
        owner = item.owner;
        questionsFound.push({
            'title': title,
            'link': link,
            'answered': answered,
            'author_name': owner.display_name,
            'author_link': owner.link,
            'author_icon': owner.profile_image
        });
    }
    if(questionsFound.length<1){
      var attach = [{
          'fallback': 'No more answers found. Perhaps try a web search?',
          'color': '#F44336',
          'title': 'No more answers found.',
          'text': 'Perhaps try a <https://ddg.gg/' + querystring.escape(search) + '|web search>?',
      }];
      res.json ({
        attachments: attach
      })
    }else{
      var attach=[];
      var col='';
      for (var i = 0; i < 5; i++) {
        var q = questionsFound[i]

        if (q.answered) {
            col = ANSWERED_COLOUR;
        } else {
            col = UNANSWERED_COLOUR;
        }

        if(i==4){
        attach.push({
                'fallback': q.title + ' - ' + q.link,
                'color': col,
                'pretext': 'Result #' + (((page - 1) * 5) + i + 1).toString(),
                'author_name': q.author_name,
                'author_link': q.author_link,
                'author_icon': q.author_icon,
                'title': q.title,
                'title_link': q.link,
                'callback_id': 'so_pagination',
                'actions': [
                 {
                     'name': 'showmore',
                     'text': 'More',
                     'type': 'button',
                     'value': search+'|'+page.toString()
                 }
             ]
            })
          }else{
            attach.push({
              'fallback': q.title + ' - ' + q.link,
              'color': col,
              'pretext': 'Result #' + (((page - 1) * 5) + i + 1).toString(),
              'author_name': q.author_name,
              'author_link': q.author_link,
              'author_icon': q.author_icon,
              'title': q.title,
              'title_link': q.link
                })
          }
      }
      res.json( {
        text: 'You searched Stack Overflow for *`'+search+'`* - these are the results that came back:',
        attachments: attach
      })
    }
});
}
