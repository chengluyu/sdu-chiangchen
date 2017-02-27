const Jar = require('./jar')
const Requests = require('./requests/user')
const Input = require('./input')

/**
 * User object, which stores information and session of users
 */
class User {
  /**
   * Create an user object.
   * @param {string} username
   * @param {string} password
   */
  constructor(username, password) {
    if (typeof username === 'object' && password === undefined) {
      ({ username, password } = username)
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('Invalid arguments, username and password must be strings')
    }
    this.secret = { username, password }
    this.jar = new Jar()
  }

  /**
   * Perform the login operation.
   * This method contains three steps:
   *
   * 1. Get 'PHPSESSID', which represents this session
   * 2. Download capture code image into 'check.png'
   * 3. Ask user to input the capture code
   * 4. Send the login request
   * @returns {Promise<Object>} Login result
   */
  async login() {
    // 1. Get 'PHPSESSID', which represents this session
    await Requests.getPhpSessionID(this.jar)

    // 2. Download capture code image into 'check.png'
    await Requests.downloadCaptureImage(this.jar)

    // 3. Ask user to input the capture code
    // 4. Send the login request
    let result = await Requests.login({
      username: this.secret.username,
      password: this.secret.password,
      verify: await Input.question('Capture code: ')
    }, this.jar)

    if (result.status === 1) {
      this.rawUserInfo = result.data.list
      this.rawSessionData = result.data._hash_
    }

    return {
      success: result.status === 1,
      serverMessage: result.msg
    }
  }

  /**
   * Book a seat.
   * @param {Seat} seat The seat information
   * @returns {Promise<Object>} Booking result
   */
  async book(seat) {

  }

  /**
   * Perform the logout operation.
   * @returns {Promise<Object>} Logout result
   */
  async logout() {

  }
}

module.exports = User