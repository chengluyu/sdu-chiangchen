const Requests = require('./requests/query')
const { Floor, Area } = require('./classes')

class Library {

  constructor() {

  }

  /**
   * Query status of a floor
   * @param {number} floor The floor, default value is 3
   * @returns {Floor} The floor object containing information about areas
   */
  async queryFloor(floor = 3) {
    return new Floor(await Requests.getFloorStatus(floor))
  }

  /**
   * Query status of an area
   * @param {AreaInfo} area The area metadata object
   * @returns {Area} The area object containing information about seats
   */
  async queryArea(area) {
    return new Area(await Requests.getAreaStatus(area.id))
  }

  /**
   * Book a seat.
   * @param {Seat} seat The seat information
   * @param {User} user The user object
   * @returns {Promise<Object>} Booking result
   */
  async bookSeat(seat, user) {
    let timeToken = await Requests.getTimeToken(seat.area)
    let result = await Requests.book(seat, user, timeToken)
    return {
      success: result.status === 1,
      serverMeessage: result.msg
    }
  }

}

module.exports = Library