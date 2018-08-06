class Validation {
  constructor(){

  }
  validate(fields, rules){
    var errors = [];

    for (var field of rules.required){
      if(fields[field] == ''){
        errors.push(field + ' is required.')
      }
    }
    return errors;
  }
}

module.exports.Validation = Validation;
