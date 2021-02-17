// ref: https://tomanagle.medium.com/google-oauth-with-node-js-4bff90180fe6

const path = require('path')
const querystring = require('querystring')

const CORS_ORIGIN = 'http://localhost:8080'
const auth = require(path.join(__dirname, '../.google-auth.json'))
const GOOGLE_CLIENT_ID = auth.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = auth.GOOGLE_CLIENT_SECRET

module.exports = {
  getGoogleAuthURL,
  getTokens,
  getGoogleUser,
}

function getGoogleAuthURL () {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: CORS_ORIGIN + '/auth/google',
    client_id: GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      // 'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  }

  return rootUrl + '?' + querystring.stringify(options)
}

async function getTokens (code) {
  return new Promise(function (resolve, reject) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: CORS_ORIGIN + '/auth/google',
      grant_type: 'authorization_code',
    };

    const params = {
      method: 'POST',
      protocol: 'https:',
      host: 'oauth2.googleapis.com',
      path: '/token',
      port: 443,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    const https = require('https')
    const req = https.request(params, function (res) {
      const buffer = []
      res.on('data', function (chunk) {
        buffer.push(chunk)
      })
      res.on('end', function () {
        resolve(buffer.join(''))
      })
    })

    req.on('error', function (err) {
      reject(err)
    })

    const data = querystring.stringify(values)
    req.write(data)

    req.end()
  })
}

async function getGoogleUser (code) {
  return new Promise(async function (resolve, reject) {
    const tokens = JSON.parse(await getTokens(code))

    // Fetch the user's profile with the access token and bearer
    const params = {
      protocol: 'https:',
      // ref: https://stackoverflow.com/a/24510214
      host: 'openidconnect.googleapis.com',
      path: '/v1/userinfo?alt=json&access_token=' + tokens.access_token,
      headers: {
        Authorization: 'Bearer ' + tokens.id_token,
      }
    }
    const https = require('https')
    const req = https.request(params, function (res) {
      const buffer = []
      res.on('data', function (chunk) {
        buffer.push(chunk)
      })
      res.on('end', function () {
        resolve(buffer.join(''))
      })
    })

    req.on('error', function (err) {
      reject(err)
    })

    req.end()
  })
}
