const request = require('./promise-request')
const Url = require('./url')

/**
 * 获取楼层状态的状态
 * @param {Number} floor 楼层的编号
 */
async function getFloorStatus(floor = 3) {
  let { response, body } = await request(Url.Floor(floor), {
    json: true
  })

  if (response.statusCode !== 200) {
    throw new Error(`Bad status code ${response.status} when get floor status`)
  }

  return body
}

/**
 * 获取自习区域的状态
 * @param {AreaInfo} area 自习区域信息
 */
async function getAreaStatus(area) {
  const now = new Date

  let { response, body } = await request(Url.Area(area), {
    json: true
  })

  if (response.statusCode !== 200) {
    throw new Error(`Bad status code ${response.status} when get area status`)
  }

  return body
}

/**
 * Get a time token, which is used in booking request
 * @param {Seat} seat The seat object
 * @param {Boolean} tomorrow Indicates today or tomorrow
 */
async function getTimeToken(area, tomorrow = false) {
  let date = new Date()

  if (tomorrow) {
    date.setDate(date.getDate() + 1)
  }

  let { response, body } = await request(Url.TimeToken(area.id, date), {
    json: true
  })

  if (response.statusCode !== 200) {
    throw new Error(`Bad status code ${response.status} when get available intervals`)
  }

  // console.log(require('util').inspect(body, false, 4, true))
  if (body.status === 1 && body.data.list.length > 0) {
    return body.data.list[0].id
  }

  throw new Error('No time token received')
}

/**
 * 预约座位
 * @param {Seat} seat 座位
 * @param {User} user 用户信息
 * @param {Number} timeToken
 * @return
 */
async function book(seat, user, timeToken) {
  let { response, body } = await request(Url.Booking(seat.id), {
    method: 'POST',
    form: {
      'access_token': user.jar.get('access_token'),
      'userid': user.jar.get('userid'),
      'segment': timeToken,
      'type': 1
    },
    headers: { cookie: user.jar.toString() },
    json: true
  })

  if (response.statusCode !== 200) {
    throw new Error(`Bad status code ${response.status} when book the seat`)
  }

  return body
}

module.exports = {
  getFloorStatus,
  getAreaStatus,
  getTimeToken,
  book
}
