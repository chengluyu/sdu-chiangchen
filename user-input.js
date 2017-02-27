
const readline = require('readline');
const { getPass } = require('getpass')

function createStdIO() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

module.exports = {

  question: async function (query) {
    const rl = createStdIO();

    return new Promise(resolve => {
      rl.question(query, answer => {
        resolve(answer);
        rl.close();
      });
    });
  },

  password: async function (prompt) {
    return new Promise((resolve, reject) => {
      getPass({ prompt }, (error, pw) => error ? reject(error) : resolve(pw))
    })
  },

  /**
   * 让用户从一个列表里选择一项
   * @param {Array<any>} list 待选择的列表
   * @param {Function} formatter 格式化输出的函数
   * @return {any} 返回用户选择的项
   */
  chooseFromList: async function (query, list, formatter) {
    const rl = createStdIO();

    const iteratee = typeof formatter === 'function'
        ? (x, i) => console.log(`[${i + 1}]`, formatter(x))
        : (x, i) => console.log(`[${i + 1}]`, x.toString());

    list.forEach(iteratee);

    return new Promise(resolve => {
      rl.question(query, answer => {
        answer = parseInt(answer, 10);
        if (1 <= answer && answer <= list.length) {
          resolve(list[answer]);
        } else {
          reject(new Error('Invaild answer.'));
        }
        rl.close();
      });
    });
  }
}



