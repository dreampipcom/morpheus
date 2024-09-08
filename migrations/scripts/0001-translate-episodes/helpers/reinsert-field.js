const fs = require('fs');
const _ = require('lodash');
const { params } = require('../params');


const reinsertField = ({ locale, fieldName }) => {
    //const fieldName = params.fieldName
    //const locale = params.locale
    function updateOriginalWithFilteredData(originalFilePath, filteredDataPath) {
        // Load the original exported JSON file and the filtered data
        const originalData = JSON.parse(fs.readFileSync(originalFilePath, 'utf-8'));
        const filteredData = JSON.parse(fs.readFileSync(filteredDataPath, 'utf-8'));

        // For each filtered data item, navigate to the original entry and replace
        const result = filteredData.map((dataItem, i) => {
            const result = { ...originalData }
            if (result?.items && result.items[i] && result.items[i].fields) {
                const nextData =  _.merge({}, result.items[i].fields.superData, { [locale]: { [fieldName]: dataItem } });
                result.items[i].fields = {}
               // console.log({ result: result.items[0], next: JSON.stringify(nextData['ar'])})
                result.items[i].fields.superData = { 'en-US': nextData }
            }

            return result
        })[0];

        console.log({ result: result.items[0].fields.superData })

        // Save the updated data back to the original file
        fs.writeFileSync(`./migrations/data/destination-${locale}.json`, JSON.stringify(result, null, 4), 'utf-8');
        console.log("Updated the original data with filtered results.");
    }

    updateOriginalWithFilteredData(`./migrations/data/export.json`, `./migrations/data/migration-${locale}.json`);
}

module.exports = {
    reinsertField
};
