const Coverpage = require('./Components/Coverpage');

const ComponentFactory = (name, banner, options) => {
  switch(name.toLowerCase()){
    case 'coverpage':
      return new Coverpage(options, banner);
    break;
  }
}

module.exports = ComponentFactory;
