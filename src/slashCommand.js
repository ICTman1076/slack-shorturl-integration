const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')
const request = require('request-promise-native')
const zlib = require("zlib");
const querystring = require('querystring');
const soreq = require("./soreq");

const ANSWERED_COLOUR = '#4CAF50';
const UNANSWERED_COLOUR = '#CDDC39';


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
  const page = 1;
  const search = body.text;
  resolve(soreq(search,page))
})

module.exports = (res, body) => {
  const page = 1;
  const search = body.text;
  return soreq(res,search,page)
}
