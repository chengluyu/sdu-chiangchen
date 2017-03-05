
const readline = require('readline');
const { getPass } = require('getpass')

function createStdIO() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
}

module.exports = {

  /**
   * Ask user to input a string
   * @param {string} prompt The prompt string
   * @returns {Promise<string>} The string
   */
  question: async function (prompt) {
    const rl = createStdIO()

    return new Promise(resolve => {
      rl.question(prompt, answer => {
        resolve(answer)
        rl.close()
      })
    })
  },

  /**
   * Ask user to input a password
   * @param {string} prompt The prompt string
   * @returns {Promise<string>} The password
   */
  password: async function (prompt) {
    return new Promise((resolve, reject) => {
      getPass({ prompt }, (error, pw) => error ? reject(error) : resolve(pw))
    })
  },

  /**
   * Ask user to select an item from a list
   * @param {Array<Object>} list The list
   * @param {Function} formatter A function that convert objects to strings
   * @return {Promise<Object>} The item selected by user
   */
  chooseFromList: async function (query, list, formatter) {
    const rl = createStdIO();

    const iteratee = typeof formatter === 'function'
        ? (x, i) => console.log(`[${i + 1}]`, formatter(x))
        : (x, i) => console.log(`[${i + 1}]`, x.toString())

    list.forEach(iteratee);

    return new Promise((resolve, reject) => {
      rl.question(query, answer => {
        answer = parseInt(answer, 10)
        if (1 <= answer && answer <= list.length) {
          resolve(list[answer - 1])
        } else {
          reject(new Error('Invaild answer.'))
        }
        rl.close()
      })
    })
  }
}



