// built-in modules
const fs = require('fs-promise')

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

})

router.get('/login', async (ctx, next) => {

})

router.get('/area', async (ctx, next) => {

})

router.get('/floor', async (ctx, next) => {

})

router.get('/reserve', async (ctx, next) => {

})

app.use(router.route())
app.use(router.allowedMethods())

app.listen(3000)
console.log('Server is running on port 3000')