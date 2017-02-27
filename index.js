const UserInput = require('./lib/user-input')
const Jar = require('./lib/jar')
const { User, Query } = require('./lib/requests')

async function main() {
  try {
    let jar = new Jar()

    await User.getPhpSessionID(jar)
    await User.downloadCaptureImage(jar)
    
    let form = {
      username: await UserInput.question('Username: '),
      password: await UserInput.password('Password'),
      verify: await UserInput.question('Capture code: ')
    }
    
    if (await User.login(form, jar)) {
      console.log('Login success')
    } else {
      console.log('Login failed')
      return
    }
    
    let floorStatus = await Query.getFloorStatus();
    let selectedArea = await UserInput.chooseFromList('Select an area: ', floorStatus.areas);
    console.log('You selected: ', selectedArea.name);

    let areaStatus = await Query.getAreaStatus(selectedArea.id);
    let selectedSeat = await UserInput.chooseFromList('Select a seat: ', areaStatus.seats);
    console.log('You selected: ', selectedSeat.name);

  } catch (e) {
    console.log(e)
  }
}

main()