// built-in modules
const fs   = require('fs-promise')
const path = require('path')

// third-party modules
const Koa          = require('koa')
const Router       = require('koa-router')
const BodyParser   = require('koa-bodyparser')
const Randomstring = require('randomstring')

// my modules
const Requests  = require('./lib/requests/user')
const CookieJar = require('./lib/jar')

// global variables
let app          = new Koa()
let router       = new Router()
let tokenStorage = new Map()

app.use(BodyParser())

router.get('/capturecode', async (ctx, next) => {
  let token = Randomstring.generate(32)
  let jar = new CookieJar()

  tokenStorage.set(token, jar)

  await Requests.getPhpSessionID(jar)
  const imageData = await Requests.fetchCaptureImage(jar)
  const base64Data = (new Buffer(imageData)).toString('base64')

  ctx.set('Content-Type', 'application/json')
  ctx.body = JSON.stringify({
    token, capture_code: (new Buffer(imageData)).toString('base64')
  })

  // for debug use only
//   ctx.body = `
// <html>
//   <body>
//     <h1>Login</h1>
//     <img src="data:image/png;base64,${base64Data}" />
//     <form action="/login" method="post">
//       Username:
//       <input name="username" type="text">
//       Password:
//       <input name="password" type="password">
//       Capture Code:
//       <input name="verify" type="text">
//       Token:
//       <input name="token" type="text" value="${token}">
//       <input type="submit">
//     </form>
//   </body>
// </html>`

  await next()
})

router.post('/login', async (ctx, next) => {
  const { username, password, verify, token } = ctx.request.body

  // check if the token is valid
  if (!tokenStorage.has(token)) {
    console.log('invalid token:', ctx.request.body)
    ctx.body = 'Invalid token'
    return await next()
  }

  let jar = tokenStorage.get(token)

  let result = await Requests.login({ username, password, verify }, jar)

  ctx.set('Content-Type', 'application/json')
  ctx.body = JSON.stringify(result)

  await next()
})

router.get('/area', async (ctx, next) => {

})

router.get('/floor', async (ctx, next) => {

})

router.get('/reserve', async (ctx, next) => {

})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
console.log('Server is running on port 3000')

process.on('SIGINT', () => {
  console.log('\nBye')
  process.exit()
})