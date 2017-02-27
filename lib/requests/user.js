const fs = require('fs')
const request = require('./promise-request')
const Url = require('./url')

async function getPhpSessionID(jar) {
  let { response: { headers } } = await request(Url.Base)
  jar.add(headers['set-cookie'])
}

async function downloadCaptureImage(jar) {
  let { response, body } = await request(Url.CaptureCode, {
    headers: { cookie: jar.toString() },
    encoding: null
  })
  return new Promise((resolve, reject) => {
    fs.writeFile('check.png', body, { encoding: 'binary' }, error => error ? reject(error) : resolve())
  })
}

async function login(form, jar) {
  let { response: { headers }, body } = await request(Url.Login, {
    method: 'POST',
    headers: { cookie: jar.toString() },
    form,
    json: true
  })
  jar.add(headers['set-cookie'])
  return body.status === 1
}

module.exports = {
  getPhpSessionID,
  downloadCaptureImage,
  login
}