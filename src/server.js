const Express = require('express')
const bodyParser = require('body-parser')
const createShortUrlsFactory = require('./createShortUrls')
const slashCommand = require('./slashCommand')

const interaction = require('./interaction')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const slackToken="a";
const apiKey = "only here to not break things"
const PORT = 80

if (!slackToken || !apiKey) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY')
  process.exit(1)
}

const port = PORT || 80

const rebrandlyClient = createShortUrlsFactory(apiKey)

app.post('/cmd/so', (req, res) =>
  slashCommand(res, req.body)
)

app.post('/interaction', (req, res) =>
  interaction(req,res)
)

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})
