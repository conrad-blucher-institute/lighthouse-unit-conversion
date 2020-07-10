let default_fixed = 4;
const lhc = require('./libs/lighthouse-converter');

exports.hello = function () {
  console.log("This is a message from the lighthouse-unit-conversion package");
};

/** 
 * Sets the decimal places globally
 * @param {number} newFixed the number of decimal places to set globally
*/
exports.setDecimalPlaces = (newFixed) => {
  if (isNaN(newFixed)) throw Error('Argument recieved is not a number');
  default_fixed = newFixed;
}

/** 
 * Converts celsius to fahrenheit
 * @param {number} celsius celsius (temperature)
 * @param {number} fixed the number of decimal places for the conversion
 * @returns {number} a temperature in fahrenheit
*/
exports.celsiusToFahren = (celsius, fixed = default_fixed) => {
  return +(celsius * 1.800 + 32.00).toFixed(fixed);
}

/** 
 * Converts fahrenheit to celsius
 * @param {number} fahren fahrenheit (temperature)
 * @param {number} fixed the number of decimal places for the conversion
 * @returns {number} a temperature in celsius
*/
exports.fahrenToCelsius = (fahren, fixed = default_fixed) => {
  return +((fahren - 32.00) / 1.800).toFixed(fixed);
}

/** 
 * Converts feet to inches
 * @param {number} feet feet as a number (ex: 1, 2, 3)
 * @param {number} fixed the number of decimal places for the conversion
 * @returns {number} a number in inches
*/
exports.feetToInches = (feet, fixed = default_fixed) => {
  return +(feet * 12).toFixed(fixed);
}

/** 
 * Converts inches to feet
 * @param {number} inches inches as a number (ex: 1, 2, 3)
 * @param {number} fixed the number of decimal places for the conversion
 * @returns {number} a number in feet
*/
exports.inchesToFeet = (inches, fixed = default_fixed) => {
  return +(inches / 12).toFixed(fixed);
}

exports.lhc = lhc;