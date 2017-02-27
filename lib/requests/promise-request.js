const R = require('request');

module.exports = function (uri, options) {
  return new Promise((resolve, reject) => {
    R(uri, options, (error, response, body) => {
      if (error) {
        reject(error)
      } else {
        resolve({ response, body })
      }
    })
  })
}