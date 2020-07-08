const percision = 4;
const lhc = require('./libs/LighthouseConvert');

exports.hello = function () {
  console.log("This is a message from the lighthouse-unit-conversion package");
};

exports.setDecimalPlaces = (newPercision) => {
  if (isNaN(newPercision)) return;
  percision = newPercision;
}

exports.celsiusToFahren = (celsius) => {
  return celsius * 1.800 + 32.00;
}

exports.fahrenToCelsius = (fahren) => {
  return +((fahren - 32.00) / 1.800).toPrecision(percision);
}

exports.lhc = lhc;