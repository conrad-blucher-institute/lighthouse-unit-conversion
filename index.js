let default_fixed = 4;
const lhc = require('./libs/LighthouseConvert');

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

exports.lhc = lhc;