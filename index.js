let default_fixed = 4;
const lhc = require('./libs/LighthouseConvert');

exports.hello = function () {
  console.log("This is a message from the lighthouse-unit-conversion package");
};

exports.setDecimalPlaces = (newFixed) => {
  if (isNaN(newFixed)) return;
  default_fixed = newFixed;
}

exports.celsiusToFahren = (celsius, fixed = default_fixed) => {
  return +(celsius * 1.800 + 32.00).toFixed(fixed);
}

exports.fahrenToCelsius = (fahren, fixed = default_fixed) => {
  return +((fahren - 32.00) / 1.800).toFixed(fixed);
}

exports.lhc = lhc;