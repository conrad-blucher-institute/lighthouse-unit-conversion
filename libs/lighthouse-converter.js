const fsp = require('fs').promises;
const _ = require('underscore');
const seriesJson = require('../data/series.json');
const configFileLoc = __dirname + '/../config/lighthouse-series.conf';
const seriesFileLoc = __dirname + '/.././data/series.json';
let default_precision = 4;
const seriesStruct = {id: 'id', abbr: 'abbr', type: 'type', unit: 'unit', name: 'name', source: 'source', fields: 'fields', convert: 'convert', desc: 'desc'};
Object.freeze(seriesStruct);

const lhc = {
    seriesStruct: seriesStruct,

    /** 
     * Retrieves all series in json format
     * @returns {Array<Object>} an array of objects representing all the series
    */
    getSeries: () => {
        return seriesJson;
    },

    /**
     * Converts an array of observations
     * @param {string} seriesKey either the name or abbreviation of the series
     * @param {Array<number>} values an array of values that will be converted
     * @returns {Array<number>} an array of numbers that were converted to the proper value
     * @throws {Error} serie is null or undefined, cannot be found
     */
    convertObservations: (seriesKey, values) => {
        const serie = lhc.findASeries(seriesKey);
        
        if (serie == null || serie == undefined) {
            throw new Error(`Cannot find the series provided by ${seriesKey}`);
        }

        return _.map(values, (value) => {
            if (serie.convert && serie.convert === 0) {
                // do nothing
            } else {
                return +(value * serie.convert).toPrecision(default_precision);
            }
        });
    },

    /**
     * Gets the default percision for all numbers being converted
     * @returns {number} the default_precision
     */
    getDefaultPrecision: () => {
        return default_precision;
    },

    /**
     * Sets the default percision for all numbers being converted
     * @param {number} newPrecision a number that determines the number of decimal places
     * @throws {Error} newPrecision is not a valid number
     */
    setDefaultPercision: (newPrecision) => {
        if (!isNan(newPrecision)) {
            default_precision = newPrecision;
        } else {
            throw new Error('newPrecison is an invalid number');
        }
    },

    /**
     * Looks for a series in the series list defined in series.json
     * @param {string} searchValue a string that will be searched on the series abbr and name
     * @returns {Object} a serie that is found in series
     * @throws {Error} search value is null or undefined
     */
    findASeries: (searchValue) => {
        if (searchValue == null) throw new Error('Search value is undefined or null');
        const seriesList = lhc.getSeries();
        const serie = _.find(seriesList, (item) => {
            const abbr = item.abbr ? item.abbr.toLowerCase() : '';
            const name = item.name ? item.name.toLowerCase() : '';
            return abbr === searchValue.toLowerCase() || name === searchValue.toLowerCase();
        });
        return serie;
    },

    groupSeries: (keyToGroup) => {
        return _.groupBy(seriesJson, keyToGroup);
    }
};

module.exports = lhc;
