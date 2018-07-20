const request = require('request')
const zlib = require('zlib');
const querystring = require('querystring');
const soreq = require("./soreq");

const ANSWERED_COLOUR = '#4CAF50';
const UNANSWERED_COLOUR = '#CDDC39';

module.exports = (initialReq, res) => {
   const payload = JSON.parse(initialReq.body.payload);

   const payloadvalue = payload.actions[0].value.split('|');
   const page = parseInt(payloadvalue[1],10)+1;
   const search = payloadvalue[0]

   soreq(res,search,page)
}
