const _ = require('lodash'),
      log = require('./utils/Log');

class Banner {

  constructor(options){
    this._options = options;
  }

  get(k) {
    return _.get(this._options, k, _.get(this.defaults, k));
  }

  get defaults(){
    return {
      id: 1,
      name: 'Basic',
      width: 300,
      height: 250,
      states: [
        {
          id: 1,
          components: [
            {
              name: 'Coverpage',
              options: {
                imgUrl: 'https://media.giphy.com/media/LLWP1seiT4fC/giphy.gif'
              }
            }
          ]
        }
      ]
    }
  }

  get options(){
    return _.mapValues(this.defaults, (v, k, o) => {
      return this.get(k);
    })
  }
  
}
module.exports = Banner;
