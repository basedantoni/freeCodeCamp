/*
*
*
*       Complete the handler logic below
*       
*       
*/

const metricRound = (initNum, conversion) => Math.round((initNum * conversion) * 100000) / 100000;
const impRound = (initNum, conversion) => Math.round((initNum / conversion) * 100000) / 100000;

function ConvertHandler() {

  const alpha = /[A-Za-z]/g
  
  this.getNum = function(input) {
    var result = input.split(alpha)[0];

    if(result.includes('/')) {
      let fractions = result.split('/');

      if(!fractions[1]) {
        fractions[1] = 1;
      }

      result = Math.round((fractions[0] / fractions[1]) * 100000) / 100000;
    }
    
    return result;
  };
  
  this.getUnit = function(input) {
    var result = input.match(alpha).join('');
    
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    var result = initUnit === 'mi' 
      ? 'km' 
      : initUnit === 'lbs' 
      ? 'kg' 
      : initUnit === 'gal' 
      ? 'L' 
      : initUnit === 'km'
      ? 'mi'
      : initUnit === 'kg'
      ? 'lbs'
      : initUnit === 'L'
      ? 'gal'
      : 'invalid unit'
    
    return result;
  };

  this.spellOutUnit = function(unit) {
    var result = unit === 'mi' 
      ? 'miles' 
      : unit === 'km' 
      ? 'kilometers' 
      : unit === 'lbs' 
      ? 'pounds' 
      : unit === 'kg'
      ? 'kilograms'
      : unit === 'gal'
      ? 'gallons'
      : unit === 'L'
      ? 'liters'
      : 'invalid unit'
    
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;

    if(initUnit === 'mi') {
      result = metricRound(initNum, miToKm);
    }
    if(initUnit === 'lbs') {
      result = metricRound(initNum, lbsToKg);
    }
    if(initUnit === 'gal') {
      result = metricRound(initNum, galToL);
    }
    if(initUnit === 'km') {
      result = impRound(initNum, miToKm)
    }
    if(initUnit === 'kg') {
      result = impRound(initNum, lbsToKg);
    }
    if(initUnit === 'L') {
      result = impRound(initNum, galToL);
    }
  
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    return result;
  };
  
}

module.exports = ConvertHandler;
