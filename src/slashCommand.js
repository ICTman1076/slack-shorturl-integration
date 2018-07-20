const request = require('request-promise-native')
const zlib = require("zlib");
const querystring = require('querystring');
const soreq = require("./soreq");

const ANSWERED_COLOUR = '#4CAF50';
const UNANSWERED_COLOUR = '#CDDC39';

module.exports = (res, body) => {
  const page = 1;
  const search = body.text;
  return soreq(res,search,page)
}
