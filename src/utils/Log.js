const _ = require('lodash'),
      chalk = require('chalk'),
      moment = require('moment');

const Log = (s) => {
  console.log(`[${chalk.rgb(255,255,0)(moment().format('YYYY-MM-DD HH:mm:ss'))}] ${ s }`)
  _.isObject(s) ? console.dir(s): '';
}
module.exports = Log;
