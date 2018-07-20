const Express = require('express')
const bodyParser = require('body-parser')
const slashCommand = require('./slashCommand')

const interaction = require('./interaction')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

const slackToken="a";
const PORT = 80

const port = PORT || 80

app.post('/cmd/so', (req, res) =>
  slashCommand(res, req.body)
)

app.post('/interaction', (req, res) =>
  interaction(req,res)
)

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})
