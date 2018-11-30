const chalk = require('chalk'),
      moment = require('moment');

const Log = (s) => console.log(`[${chalk.rgb(255,255,0)(moment().format('YYYY-MM-DD HH:mm:ss'))}] ${ s }`);
module.exports = Log;
