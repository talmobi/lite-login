// ref: https://tomanagle.medium.com/google-oauth-with-node-js-4bff90180fe6

const path = require('path')
const querystring = require('querystring')

module.exports = {
  google: google
}

function google (opts) {
  return {
    url: getGoogleAuthURL(opts),
    getUser: async function getUser (code) {
      return await getGoogleUser(code, opts)
    }
  }
}

function getGoogleAuthURL (opts) {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: opts.redirect_uri || opts.redirect_url,
    client_id: opts.client_id,
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

async function getTokens (code, opts) {
  return new Promise(function (resolve, reject) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: opts.client_id,
      client_secret: opts.client_secret,
      redirect_uri: opts.redirect_uri || opts.redirect_url,
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

async function getGoogleUser (code, opts) {
  return new Promise(async function (resolve, reject) {
    const tokens = JSON.parse(await getTokens(code, opts))

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
