const UserInput = require('./lib/user-input')
const Jar = require('./lib/jar')
const { User, Query } = require('./lib/requests')

async function tryAutoLogin() {
  const { existsSync, readFileSync } = require('fs')

  let form = existsSync('./auto-login.json')
      ? JSON.parse(readFileSync('./auto-login.json', 'utf8'))
      : { username: await UserInput.question('Username: '),
          password: await UserInput.password('Password') }

  form.verify = await UserInput.question('Capture code: ')
  return form
}

async function main() {
  try {
    let jar = new Jar()

    await User.getPhpSessionID(jar)
    await User.downloadCaptureImage(jar)
    
    let form = await tryAutoLogin()
    
    if (await User.login(form, jar)) {
      console.log('Login success')
    } else {
      console.log('Login failed')
      return
    }
    
    // let floorStatus = await Query.getFloorStatus();
    // let selectedArea = await UserInput.chooseFromList('Select an area: ', floorStatus.areas);
    // console.log('You selected: ', selectedArea.name);

    // let areaStatus = await Query.getAreaStatus(selectedArea.id);
    // let selectedSeat = await UserInput.chooseFromList('Select a seat: ', areaStatus.seats);
    // console.log('You selected: ', selectedSeat.name);

  } catch (e) {
    console.log(e)
  }
}

main()