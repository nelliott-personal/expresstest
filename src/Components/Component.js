const _ = require('lodash');
      Banner = require('../Banner');
      log = require('../utils/Log');

class Component {

  constructor(options, banner) {
    this._options = options || { };
    this.banner = banner || new Banner();
  }

  get(k) {
    return _.get(this._options, k, _.get(this.defaults, k));
  }

  get defaults() {
    return { };
  }

  get options(){
    return _.mapValues(this.defaults, (v, k, o) => {
      return this.get(k);
    })
  }

}

module.exports = Component;
