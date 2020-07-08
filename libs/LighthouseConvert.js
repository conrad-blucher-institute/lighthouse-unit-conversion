const fsp = require('fs').promises;
const fs = require('fs');
const _ = require('underscore');
const seriesJson = require('../data/series.json');
const configFileLoc = __dirname + '/../config/lighthouse-series.conf';
const seriesFileLoc = __dirname + '/.././data/series.json';
let default_percision = 4;

// Can only be used by developers working on this package, run this function to reset the series.json file
async function setupSeries () {
    const seriesFileData = await fsp.readFile(seriesFileLoc).catch(error => console.error(error));

    // Return if json data exists in file
    if (seriesFileData && JSON.parse(seriesFileData.toString()).length > 0) {
        return JSON.parse(seriesFileData.toString());
    }

    const data = await fsp.readFile(configFileLoc).catch(error => console.error(error));
    const text = data.toString();
    let lines = _.filter(text.split(/(.+)+/g), (line) => line !== '' && line.length > 5); // Removing empty elements

    // Creating series
    const series = _.map(lines, (line, index) => {
        const config = line.split(':');
        return {
            id: index + 1,
            abbr: config[0],
            type: config[1],
            unit: config[2],
            precision: config[3],
            name: config[4],
            source: config[5],
            fields: config[6],
            convert: config[2] ? Number(config[2].replace(/[^0-9\.]+/g, '')) : 1
        };
    });

    // Write to file
    await fsp.writeFile('./data/series.json', JSON.stringify(series)).catch(error => console.error(error));

    return series;
}

const lhc = {
    /** 
     * Retrieves all series in json format
     * @returns {Array<Object>} an array of objects representing all the series
    */
    getSeries: () => {
        return seriesJson;
    },

    /**
     * Converts an array of observations given by a sx### table
     * @param {string} seriesKey either the name or abbreviation of the series
     * @param {Array<number>} values an array of values that will be converted
     * @returns {Array<number>} an array of numbers that were converted to the proper value
     * @throws {Error} serie is null or undefined, cannot be found
     */
    convertObservations: (seriesKey, values) => {
        const serie = lhc.findSerie(seriesKey);
        
        if (serie == null || serie == undefined) {
            throw new Error(`Cannot find the series provided by ${seriesKey}`);
        }

        return _.map(values, (value) => {
            if (serie.convert && serie.convert === 0) {
                // do nothing
            } else {
                return +(value * serie.convert).toPrecision(default_percision);
            }
        });
    },

    /**
     * Gets the default percision for all numbers being converted
     * @returns {number} the default_percision
     */
    getDefaultPercision: () => {
        return default_percision;
    },

    /**
     * Sets the default percision for all numbers being converted
     * @param {number} newPercision a number that determines the number of decimal places
     * @throws {Error} newPrecision is not a valid number
     */
    setDefaultPercision: (newPercision) => {
        if (!isNan(newPercision)) {
            default_percision = newPercision;
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
    findSerie: (searchValue) => {
        if (searchValue == null) throw new Error('Search value is undefined or null');
        const seriesList = lhc.getSeries();
        const serie = _.find(seriesList, (item) => {
            const abbr = item.abbr ? item.abbr.toLowerCase() : '';
            const name = item.name ? item.name.toLowerCase() : '';
            return abbr === searchValue.toLowerCase() || name === searchValue.toLowerCase();
        });
        return serie;
    }
};

module.exports = lhc;
