const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')
const request = require('request-promise-native')
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

  const req = request({
    url: 'https://api.stackoverflow.com/2.2/search?order=desc&sort=activity&intitle='+body.text+'&site=stackoverflow',
    method: 'GET',
    headers: {
      //apikey,
      'Content-Type': 'application/json'
    },
//    body: JSON.stringify(body, null, 2),
    resolveWithFullResponse: true
  })

  req
    .then((response) => {
      const result = JSON.parse(response.body)
      resolve(result)
    })
    .catch((err) => {
      resolve(err)
    })
  })

module.exports = slashCommandFactory
