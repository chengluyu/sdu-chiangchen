const qs = require('querystring')

module.exports = {
  Base: 'http://58.194.172.92:85',
  Login: 'http://58.194.172.92:85/api.php/login',
  CaptureCode: 'http://58.194.172.92:85/api.php/check',
  Floor (id) { return `http://58.194.172.92:85/api.php/areas/${id}` },
  Area (id) {
    const now = new Date()
    return `http://58.194.172.92:85/api.php/spaces_old?${qs.stringify({
      area: id,
      day: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      startTime: `${now.getHours()}:${now.getMinutes()}`,
      endTime: '22:10'
    })}`
  },
  Booking (id) { return `http://58.194.172.92:85/api.php/spaces/${id}/book` },
  AvailableDay (id) { return `http://58.194.172.92:85/api.php/space_days/${id}` },
  TimeToken (id, date) {
    return `http://58.194.172.92:85/api.php/space_time_buckets?day=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&area=${id}`
  }
}