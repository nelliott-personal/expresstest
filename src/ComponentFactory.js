const Coverpage = require('./Components/Coverpage');

const componentFactory = (name, banner, options) => {
  switch(name.toLowerCase()){
    case 'coverpage':
      return new Coverpage(options, banner);
    break;
  }
}

module.exports = componentFactory;
