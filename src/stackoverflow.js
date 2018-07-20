const soreq = require("./soreq");

module.exports = {
  "cmd": (res, body) => {
    const page = 1;
    const search = body.text;
    return soreq(res,search,page)
  },
  "button": (initialReq, res) => {
     const payload = JSON.parse(initialReq.body.payload);

     const payloadvalue = payload.actions[0].value.split('|');
     const page = parseInt(payloadvalue[1],10)+1;
     const search = payloadvalue[0]

     soreq(res,search,page)
  }
}
