const fs = require('fs')
const request = require('./promise-request')
const Url = require('./url')
const UserInput = require('./user-input')
const Jar = require('./jar')

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

async function main() {
  try {
    let jar = new Jar()

    await getPhpSessionID(jar)
    await downloadCaptureImage(jar)
    
    let form = {
      username: await UserInput.question('Username: '),
      password: await UserInput.password('Password'),
      verify: await UserInput.question('Capture code: ')
    }
    
    if (await login(form, jar)) {
      console.log('Login success')
    } else {
      console.log('Login failed')
    }
    

  } catch (e) {
    console.log(e)
  }
}

main()