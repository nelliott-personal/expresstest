const _ = require('lodash'),
      log = require('../utils/Log'),
      Component = require('./Component');

class Coverpage extends Component{

  constructor(options, banner){
    super(options, banner);
  }

  get defaults(){
    return {
      width: this.banner.get('width'),
      height: this.banner.get('height'),
      imgUrl: 'https://media.giphy.com/media/Aff4ryYiacUO4/giphy.gif'
    }
  }

  render(){
    return `
      <div style="width: ${ this.get('width') }px; height: ${ this.get('height') }px;">
        <img src="${ this.get('imgUrl') }" width="${ this.get('width') }" height="${ this.get('height') }" />
      </div>
    `;
  }

}

module.exports = Coverpage;
