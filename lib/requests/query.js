const request = require('./promise-request')
const Url = require('./url')
const { Seat, Area, AreaInfo, Floor } = require('../classes')

/**
 * 获取楼层状态的状态
 * @param {Number} floor 楼层的编号
 */
async function getFloorStatus(floor = 3) {
  let { response, body } = await request(Url.Floor(floor), {
    json: true
  })
  
  if (response.statusCode !== 200) {
    throw new Error(`Bad status code ${response.status} when get floor status`);
  }

  return new Floor(body);
}

/**
 * 获取自习区域的状态
 * @param {AreaInfo} area 自习区域信息
 */
async function getAreaStatus(area) {
  const now = new Date;

  let { response, body } = await request(Url.Area(area), {
    json: true
  })

  if (response.statusCode !== 200) {
    throw new Error(`Bad status code ${response.status} when get area status`)
  }

  return new Area(body)
}

/**
 * 预约座位
 * @param {Seat} seat 座位
 * @param {UserInfo} userInfo 用户信息
 * @param {Jar} jar Cookie 罐
 * @return 
 */
async function book(seat, userInfo, jar) {
  const url = 'http://58.194.172.92:85/api.php/spaces/${seat.id}/book';

  let { response, body } = await request(url, {
    method: 'POST',
    form: {
      'access_token': userInfo.accessToken,
      'userid': userInfo.id,
      segment,
      'type': 1
    },
    headers: { cookie: jar.toString() },
    json: true
  });

  if (response.statusCode !== 200) {
    throw new Error(`Bad status code ${response.status} when book the seat`);
  }

  return body;
}

module.exports = {
  getFloorStatus,
  getAreaStatus,
  book
}