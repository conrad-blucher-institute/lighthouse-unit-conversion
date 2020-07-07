const convertUnits = require('convert-units');

const Convert = {
    getList: () => {
        return convertUnits().list();
    }
};

module.exports = Convert;