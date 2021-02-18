const express = require('express')
const app = express()
const port = 3000

// https://console.cloud.google.com/home/dashboard
// - create/select project
// - APIs & Services -> Credentials -> Client ID -> Authorised redirect URIs
// - APIs & Services -> OAuth consent screen -> required + email address scope
const opts = require('./.google-auth.json') // { "client_id": "1003**...**nt.com", "client_secret": "B7**...**ve" }
opts.redirect_uri = 'http://localhost:3000/auth/google'

const ll = require('./src/index.js')
const login = ll.google(opts) // { redirect_uri, client_id, client_secret }

app.get('/', (req, res) => {
  res.send(
    `<a href="${ login.url }">Login Through Google</a>`
  )
})

app.get('/auth/google', async function (req, res) {
  const code = req.query.code
  const user = await login.getUser(code)
  res.send(
    `<pre>${ user }</pre>`
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
