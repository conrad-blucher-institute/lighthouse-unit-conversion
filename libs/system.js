const fs = require('fs');
const _ = require('underscore');

const system = {
    /**
     * Sets up the series.json file. Run this function if you make changes to the lighthous-series.conf
     * @returns {Array<Object>} an array of series generated or retrieved from the series.json file
     */
    setupSeries: async () => {
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
                convert: config[2] ? Number(config[2].replace(/[^0-9\.]+/g, '')) : 1,
                desc: config[2] ? config[2].replace(/[^0-9\.]+/g)
            };
        });
    
        // Write to file
        await fsp.writeFile('./data/series.json', JSON.stringify(series)).catch(error => console.error(error));
    
        return series;
    }
};

module.exports = system;