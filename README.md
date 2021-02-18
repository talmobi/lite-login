[![npm](https://img.shields.io/npm/v/lite-login.svg?maxAge=3600)](https://www.npmjs.com/package/lite-login)
[![npm](https://img.shields.io/npm/dm/lite-login.svg?maxAge=3600)](https://www.npmjs.com/package/lite-login)
[![npm](https://img.shields.io/npm/l/lite-login.svg?maxAge=3600)](https://www.npmjs.com/package/lite-login)

# lite-login
Login through google.

## Demo

[https://lite-login.jin.fi](https://lite-login.jin.fi)

## Easy to use

```javascript
const express = require('express')
const app = express()
const port = 3000

// https://console.cloud.google.com/home/dashboard
// - create/select project
// - APIs & Services -> Credentials -> Client ID -> Authorised redirect URIs
// - APIs & Services -> OAuth consent screen -> required + email address scope
const opts = require('./.google-auth.json') // { "client_id": "1003**...**nt.com", "client_secret": "B7**...**ve" }
opts.redirect_uri = 'http://localhost:3000/auth/google'

const ll = require('lite-login')
const login = ll.google(opts) // opts = { redirect_uri, client_id, client_secret }

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
}
```

## About

Simple login through google. Get user email.

## Why

Easy to use for minimalistic use-case.

## For who?

## Roadmap

- [x] Google
- [ ] Facebook
- [ ] Twitter

## How

Calling appropriate google REST endpoints with node's builtin https client.

ref: https://tomanagle.medium.com/google-oauth-with-node-js-4bff90180fe6

## Similar
[package/google-auth-library](https://www.npmjs.com/package/google-auth-library)

[tomanagle/google-oauth-tutorial](https://github.com/tomanagle/google-oauth-tutorial)

## Test
```
Manual tests.
```
