const fsp = require('fs').promises;
const fs = require('fs');
const _ = require('underscore');
const configFileLoc = __dirname + '/../config/lighthouse-series.conf';
const seriesFileLoc = __dirname + '/.././data/series.json';

const lhc = {
    getSeries: async () => {
        const seriesFileData = await fsp.readFile(seriesFileLoc).catch(error => console.error(error));

        // Return if json data exists in file
        if (JSON.parse(seriesFileData.toString()).length > 0) {
            return seriesFileData;
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
                fields: config[6]
            };
        });

        // Write to file
        await fsp.writeFile('./data/series.json', JSON.stringify(series)).catch(error => console.error(error));

        return series;
    },

    convertObservations: async (seriesName, values) => {
        const series = await lhc.getSeries();
        return series;
    }
};

module.exports = lhc;
