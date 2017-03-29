const assert = require('assert')

describe('Jar', () => {
  const Jar = require('../lib/jar')

  const sampleCookies = [
    {
      cookie: 'sessionid=38afes7a8; httponly; Path=/',
      key: 'sessionid',
      value: '38afes7a8'
    },
    {
      cookie: 'qwerty=219ffwef9w0f; Domain=somecompany.co.uk; Path=/; Expires=Wed, 30 Aug 2019 00:00',
      key: 'qwerty',
      value: '219ffwef9w0f'
    },
    {
      cookie: 'id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly',
      key: 'id',
      value: 'a3fWa'
    }
  ]

  describe('#add()', () => {
    it('should keep the cookies accurately', () => {
      let jar = new Jar()
      sampleCookies.forEach(sample => {
        jar.add(sample.cookie)
        assert.equal(jar.get(sample.key), sample.value)
      })
    })
  })
})
