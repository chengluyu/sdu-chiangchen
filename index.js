const User = require('./lib/user')
const Library = require('./lib/library')
const inquirer = require('inquirer')

async function importConfig() {
  const { existsSync, readFileSync } = require('fs')

  let info

  if (existsSync('./config.json')) {
    info = JSON.parse(readFileSync('./config.json', 'utf8'))
    console.log('Detected configuration file')
  } else {
    info = await inquirer.prompt([
      {
        name: 'username',
        message: 'Username:',
        type: 'password'
      },
      {
        name: 'password',
        message: 'Password:',
        type: 'password'
      }
    ])
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
    let { selectedArea } = await inquirer.prompt({
      type: 'list',
      name: 'selectedArea',
      message: 'Select an area:',
      choices: floor.areas.map(area => {
        return { name: area.name, value: area }
      })
    })

    let area = await library.queryArea(selectedArea);
    let { selectedSeat } = await inquirer.prompt({
      type: 'list',
      name: 'selectedSeat',
      message: 'Select an seat:',
      choices: area.seats.map(seat => {
        return { name: seat.name, value: seat }
      })
    })

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