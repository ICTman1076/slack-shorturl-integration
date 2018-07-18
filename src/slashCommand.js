const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')
const request = require('request-promise-native')
const zlib = require("zlib");
const createErrorAttachment = (error) => ({
  color: 'danger',
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ['text']
})

const createSuccessAttachment = (result) => ({
  color: 'good',
  text: `*${result.link}|${result.title}>*`,
  mrkdwn_in: ['text']
})

const createAttachment = (result) => {
  if (result.constructor === Error) {
    return createErrorAttachment(result)
  }

  return createSuccessAttachment(result)
}

const slashCommandFactory = (createShortUrls, slackToken) => (body) => new Promise((resolve, reject) => {
  /*if (!body) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid body'))]
    })
  }

  /*if (slackToken !== body.token) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid token'))]
    })
  }

  //const { urls, domain, slashtags } = commandParser(body.text)

  let error
  if ((error = validateCommandInput(urls, domain, slashtags))) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(error)]
    })
  }
*/

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

  const req = request({
    url: 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&q='+body.text+'&site=stackoverflow',
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
      item=data.items[i]
      answered = item.is_answered;
      title = item.title;
      link = item.link;
      owner = item.owner
      questionsFound.push([title, link, answered, [owner.display_name, owner.link, owner.profile_image]])
    }
    if(questionsFound.length<1){
      var attach=[{
            "fallback": "No answers found. Perhaps try a web search?",
            "color": "#F44336",
            "title": "No answers found.",
            "text": "Perhaps try a <https://ddg.gg/"+body.text+"|web search>?"
        }];
      resolve({
        attachments: attach
      })
    }else{
      var attach=[];
      var col="";
      for (var i = 0; i < 5; i++) {
        var q = questionsFound[i]
        if(q[2]){
          col="#4CAF50";
        }else{
          col="#CDDC39"
        }
        attach.push({
                "fallback": q[0]+" - "+q[1],
                "color": col,
                "pretext": "Result #"+(i+1).toString(),
                "author_name": q[3][0],
                "author_link": q[3][1],
                "author_icon": q[3][2],
                "title": q[0],
                "title_link": q[1]
            })
      }
      resolve({
        text: 'You searched Stack Overflow for *`'+body.text+'`* - these are the results that came back:',
        attachments: attach
      })

    }
  })
})

module.exports = slashCommandFactory
