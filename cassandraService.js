const cassandra = require('cassandra-driver');

let client;
const getCassandraClient = (connectionData) => {
    const contactPoints = [`${connectionData.host}:${connectionData.port}`];
    const authProvider = new cassandra.auth.PlainTextAuthProvider(connectionData.username, connectionData.password);
    const localDataCenter = connectionData.dataCenter;

    client = new cassandra.Client({
        contactPoints,
        authProvider,
        localDataCenter
    });

    client.on('log', (level, loggerName, message) => {
        console.log(`${level} - ${loggerName}:  ${message}`);
    });

    return client;
}

const connect = async (connectionData) => getCassandraClient(connectionData).connect();
const disconnect = () => {
    client.shutdown();
}

const execute = (query) => client.execute(query);

const getTableMetaData = (keyspaceName, tableName) => client.metadata.getTable(keyspaceName, tableName);

const getTableData = (keyspaceName, tableName) => {
    return new Promise((resolve, reject) => {
        const rows = [];
        const query = `SELECT * FROM ${keyspaceName}.${tableName}`;
        client.eachRow(
            query,
            [],
            {prepare: true},
            (_, row) => {
                rows.push(row)
            },
            (err, result) => {
                err ? reject(err) : resolve(JSON.parse(JSON.stringify(rows)));
            }
        )

    })

}

module.exports = {
    connect,
    execute,
    disconnect,
    getTableData,
    getTableMetaData,
}