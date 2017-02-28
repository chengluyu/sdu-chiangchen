const Requests = require('./requests/query')
const { Floor, Area } = require('./classes')

class Library {

  constructor() {

  }

  async queryFloor(floor) {
    return new Floor(await Requests.getFloorStatus(floor))
  }

  async queryArea(areaID) {
    return new Area(await Requests.getAreaStatus(areaID))
  }

  async bookSeat(user) {

  }

}