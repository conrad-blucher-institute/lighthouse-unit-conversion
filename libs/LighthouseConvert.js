const fsp = require('fs').promises;
const fs = require('fs');
const _ = require('underscore');
const configFileLoc = __dirname + '/../config/lighthouse-series.conf';
const seriesFileLoc = __dirname + '/.././data/series.json';
let default_percision = 4;

const lhc = {
    getSeries: async () => {
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
    },

    convertObservations: async (seriesKey, values) => {
        const seriesList = await lhc.getSeries();
        const serie = _.find(seriesList, (item) => {
            const abbr = item.abbr ? item.abbr.toLowerCase() : '';
            const name = item.name ? item.name.toLowerCase() : '';
            return abbr === seriesKey.toLowerCase() || name === seriesKey.toLowerCase();
        });
        
        if (serie == null || serie == undefined) return null;

        return _.map(values, (value) => {
            if (serie.convert && serie.convert === 0) {
                // do nothing
            } else {
                return +(value * serie.convert).toPrecision(default_percision);
            }
        });
    },

    getDefaultPercision: () => {
        return default_percision;
    },

    setDefaultPercision: (newPercision) => {
        if (!isNan(newPercision)) {
            default_percision = newPercision;
        }
    }
};

module.exports = lhc;
