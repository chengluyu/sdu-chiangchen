const Input = require('./lib/input')
const User = require('./lib/user')
const Library = require('./lib/library')

async function importConfig() {
  const { existsSync, readFileSync } = require('fs')

  let info

  if (existsSync('./config.json')) {
    info = JSON.parse(readFileSync('./config.json', 'utf8'))
    console.log('Detected configuration file')
  } else {
    info = {
      username: await Input.question('Username: '),
      password: await Input.password('Password')
    }
  }

  return info
}

async function main() {
  try {
    let user = new User(await importConfig())

    let loginResult = await user.login()

    if (loginResult.success) {
      console.log('Login success')
    } else {
      console.log(`Login failed (reason: ${loginResult.serverMessage})`)
      return
    }

    let library = new Library()

    let floor = await library.queryFloor()
    let selectedArea = await Input.chooseFromList('Select an area: ', floor.areas)
    console.log('You selected: ', selectedArea.name)

    let area = await library.queryArea(selectedArea);
    let selectedSeat = await Input.chooseFromList('Select a seat: ', area.seats)
    console.log('You selected: ', selectedSeat.name)

    let bookResult = await library.bookSeat(selectedSeat, user)
    if (bookResult.success) {
      console.log(`Booking success (message: ${bookResult.serverMessage})`)
    } else {
      console.log(`Booking failed (reason: ${bookResult.serverMessage})`)
      return
    }

  } catch (e) {
    console.log(e)
  }
}

main()