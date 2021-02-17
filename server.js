const express = require('express')
const app = express()
const port = 8080

const Mustache = require('mustache')

const fs = require('fs')
const path = require('path')
Mustache.renderFile = function (filepath, view) {
  const file = fs.readFileSync(path.join(__dirname, filepath), 'utf8')
  return Mustache.render(file, view)
}

const googleAuthUrl = require('./src/index.js').getGoogleAuthURL()
app.get('/', (req, res) => {
  res.send(Mustache.renderFile('./templates/index.html', { href: googleAuthUrl }))
})

app.get('/auth/google', async function (req, res) {
  const code = req.query.code

  // const info = await require('./src/index.js').getTokens(code)
  const user = await require('./src/index.js').getGoogleUser(code)

  res.send(Mustache.renderFile('./templates/auth/google.html', { data: user } ))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
