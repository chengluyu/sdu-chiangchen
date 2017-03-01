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
    this.area = raw.area
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


module.exports = {
  Seat,
  Area,
  AreaInfo,
  Floor
}