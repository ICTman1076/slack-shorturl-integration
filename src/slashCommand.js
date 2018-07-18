const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')
const request = require('request-promise-native')
var zlib = require("zlib");
const createErrorAttachment = (error) => ({
  color: 'danger',
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ['text']
})

const createSuccessAttachment = (link) => ({
  color: 'good',
  text: `*<http://${link.shortUrl}|${link.shortUrl}>* (<https://www.rebrandly.com/links/${link.id}|edit>):\n${link.destination}`,
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
        // decompression chunk ready, add it to the buffer
        buffer.push(data);
    }).on('end', function () {
        //response and decompression complete, join the buffer and return
        callback(null, JSON.parse(buffer.join('')));
    }).on('error', function (e) {
        callback(e);
    });
  }

  const req = request({
    url: 'https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle='+body.text+'&site=stackoverflow',
    method: 'GET',
    resolveWithFullResponse: true
  })

getGZipped(req,function(e,data){
  resolve(data)
})
  })

module.exports = slashCommandFactory
