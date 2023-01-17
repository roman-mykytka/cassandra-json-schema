const cassandraService = require('./cassandraService');
const {
    getSchema,
    getJsonSchemaFromData,
    getJsonSchemaFromMetaData
} = require("./helpers/schema");
const {isArray} = require("./helpers/types");
const {writeJsonSchemaToJsonFile} = require("./helpers/files");

const writeJsonFile = (config) => {
    const {connectConfig, keyspaceName, tableName, jsonSchemaVersion} = config
    cassandraService.connect(connectConfig)
        .then(() => {
            console.info('Connection has been established successfully')
            Promise.all([
                cassandraService.getTableData(keyspaceName, tableName),
                cassandraService.getTableMetaData(keyspaceName, tableName)
            ]).then(([tableData, tableMetaData]) => {
                let jsonSchema;
                if (isArray(tableData) && tableData.length) {
                    const schemaData = tableData[0];
                    jsonSchema = getJsonSchemaFromData(
                        jsonSchemaVersion,
                        tableName,
                        getSchema(schemaData, 'all'),
                    );
                } else {
                    jsonSchema = getJsonSchemaFromMetaData(
                        jsonSchemaVersion,
                        tableName,
                        tableMetaData,
                    );
                }
                writeJsonSchemaToJsonFile('result.json', jsonSchema);
                cassandraService.disconnect();
            })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
};

module.exports = {
    writeJsonFile,
}