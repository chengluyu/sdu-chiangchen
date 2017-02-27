const Input = require('./lib/input')
const User = require('./lib/user')

async function tryAutoLogin() {
  const { existsSync, readFileSync } = require('fs')

  let info = existsSync('./auto-login.json')
      ? JSON.parse(readFileSync('./auto-login.json', 'utf8'))
      : { username: await Input.question('Username: '),
          password: await Input.password('Password') }

  return info
}

async function main() {
  try {
    let user = new User(await tryAutoLogin())

    let loginResult = await user.login()

    if (loginResult.success) {
      console.log('Login success')
    } else {
      console.log(`Login failed (reason: ${loginResult.serverMessage})`)
      return
    }

    // let floorStatus = await Query.getFloorStatus();
    // let selectedArea = await Input.chooseFromList('Select an area: ', floorStatus.areas);
    // console.log('You selected: ', selectedArea.name);

    // let areaStatus = await Query.getAreaStatus(selectedArea.id);
    // let selectedSeat = await Input.chooseFromList('Select a seat: ', areaStatus.seats);
    // console.log('You selected: ', selectedSeat.name);

  } catch (e) {
    console.log(e)
  }
}

main()