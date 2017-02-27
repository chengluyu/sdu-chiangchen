module.exports = {
  Base: 'http://58.194.172.92:85',
  Login: 'http://58.194.172.92:85/api.php/login',
  CaptureCode: 'http://58.194.172.92:85/api.php/check',
  Floor (id) { return `http://58.194.172.92:85/api.php/areas/${id}` },
  Area: 'http://58.194.172.92:85/api.php/spaces_old',
  Booking (id) { return `http://58.194.172.92:85/api.php/spaces/${id}/book` }
}