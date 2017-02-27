const fs = require('fs')
const request = require('./promise-request')
const Url = require('./url')
const UserInput = require('./user-input')
const Jar = require('./jar')

async function getPhpSessionID(jar) {
  let { response: { headers } } = await request(Url.Base)
  jar.add(headers['set-cookie'])
}

async function downloadCaptureImage(jar) {
  let { response, body } = await request(Url.CaptureCode, {
    headers: { cookie: jar.toString() },
    encoding: null
  })
  return new Promise((resolve, reject) => {
    fs.writeFile('check.png', body, { encoding: 'binary' }, error => error ? reject(error) : resolve())
  })
}

async function login(form, jar) {
  let { response: { headers }, body } = await request(Url.Login, {
    method: 'POST',
    headers: { cookie: jar.toString() },
    form,
    json: true
  })
  jar.add(headers['set-cookie'])
  return body.status === 1
}

class Seat {
  constructor (raw) {
    // { id: 373,
    //       no: '373',
    //       name: '373',
    //       area: 8,
    //       category: 1,
    //       point_x: 84.77306,
    //       point_x2: null,
    //       point_x3: null,
    //       point_x4: null,
    //       point_y: 22.65193,
    //       point_y2: null,
    //       point_y3: null,
    //       point_y4: null,
    //       width: 2.562226,
    //       height: 4.281768,
    //       status: 6,
    //       status_name: '使用中',
    //       area_name: 'D601过刊阅览室',
    //       area_levels: 1,
    //       area_type: 1,
    //       area_color: null }
    this.raw = raw;
    this.id = raw.id;
    this.no = raw.no;
    this.name = raw.name;
    this.status = raw.status;
    this.statusText = raw.status_name;
  }

  isAvailable() {
    return this.status === 1;
  }

  isOccupied() {
    return this.status === 6;
  }

  isReserved() {
    return this.status === 2;
  }

  isTemporarilyLeft() {
    return this.status === 7;
  }

  toString() {
    return `${this.name} (${this.statusText})`;
  }
}

class Area {
  constructor (raw) {
    if (typeof raw === 'string') {
      raw = JSON.parse(raw.trim());
    } else if (typeof raw !== 'object') {
      throw new Error('area object type mismatch');
    }

    this.raw = raw;
    this.seats = raw.data.list.map(x => new Seat(x)).filter(x => x.isAvailable());
  }
}

class AreaInfo {
  constructor (raw) {
    // { id: 10,
    //   name: '六层走廊',
    //   parentId: 3,
    //   levels: 1,
    //   isValid: 1,
    //   comment: '',
    //   sort: 2,
    //   type: 1,
    //   color: null,
    //   point_x: 71.15666,
    //   point_y: 33.42542,
    //   point_x2: 71.15666,
    //   point_y2: 50.55249,
    //   point_x3: 18.59444,
    //   point_y3: 50.55249,
    //   point_x4: 18.59444,
    //   point_y4: 33.42542,
    //   TotalCount: 35,
    //   UnavailableSpace: 23 }
    this.raw = raw;
    this.id = raw.id;
    this.name = raw.name;
    this.total = raw.TotalCount;
    this.occupied = raw.UnavailableSpace;
    this.vacancy = raw.TotalCount - raw.UnavailableSpace;
  }

  toString() {
    return `${this.name} (${this.vacancy})`;
  }
}

class Floor {
  constructor (raw) {
    if (typeof raw === 'string') {
      raw = JSON.parse(raw.trim());
    } else if (typeof raw !== 'object') {
      throw new Error('floor object type mismatch');
    }

    this.raw = raw;
    this.id = raw.data.list.areaInfo.id;
    this.name = raw.data.list.areaInfo.name;
    this.areas = raw.data.list.childArea.map(x => new AreaInfo(x));
  }
}

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

async function main() {
  try {
    let jar = new Jar()

    await getPhpSessionID(jar)
    await downloadCaptureImage(jar)
    
    let form = {
      username: await UserInput.question('Username: '),
      password: await UserInput.password('Password'),
      verify: await UserInput.question('Capture code: ')
    }
    
    if (await login(form, jar)) {
      console.log('Login success')
    } else {
      console.log('Login failed')
      return
    }
    
    let floorStatus = await getFloorStatus();
    let selectedArea = await UserInput.chooseFromList('Select an area: ', floorStatus.areas);
    console.log('You selected: ', selectedArea.name);

    let areaStatus = await getAreaStatus(selectedArea.id);
    let selectedSeat = await UserInput.chooseFromList('Select a seat: ', areaStatus.seats);
    console.log('You selected: ', selectedSeat.name);

  } catch (e) {
    console.log(e)
  }
}

main()