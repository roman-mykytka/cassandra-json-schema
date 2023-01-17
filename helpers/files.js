const fs = require('fs');
const writeJsonSchemaToJsonFile = (fileName, schema) => {
    fs.writeFile('result.json', JSON.stringify(schema), 'utf8', err => {
        if (err) {
            console.log(err);
        }

        console.log('The file was saved!');
    })
};

module.exports = {
    writeJsonSchemaToJsonFile,
}