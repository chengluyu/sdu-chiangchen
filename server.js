// built-in modules
const fs   = require('fs-promise')
const path = require('path')

// third-party modules
const Koa          = require('koa')
const Router       = require('koa-router')
const Randomstring = require('randomstring')

// my modules
const Requests  = require('./lib/requests/user')
const CookieJar = require('./lib/jar')

// global variables
let app          = new Koa()
let router       = new Router()
let tokenStorage = new Map()

router.get('/capturecode', async (ctx, next) => {
  let token = Randomstring.generate(32)
  let jar = new CookieJar()

  await Requests.getPhpSessionID(jar)
  const imageData = await Requests.fetchCaptureImage(jar)
  const base64Data = (new Buffer(imageData)).toString('base64')

  ctx.set('Content-Type', 'application/json')
  ctx.body = JSON.stringify({
    token, capture_code: (new Buffer(imageData)).toString('base64')
  })

  // for debug use
  // ctx.body = `<html><body><img src="data:image/png;base64,${base64Data}" /></body></html>`

  await next()
})

router.get('/login', async (ctx, next) => {

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
