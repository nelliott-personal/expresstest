const chalk = require('chalk')

class Priest {
  constructor(){

  }
  talk(words){

    console.log(
      chalk.hex('#FF0000')(words)
    )
  }
}

module.exports.Priest = Priest;
