module.exports = {
    connectConfig: {
        host: '127.0.0.1',
        port: '9042',
        username: 'cassandra',
        password: 'cassandra',
        dataCenter: 'datacenter1'
    },
    keyspaceName: 'group',
    tableName: 'user',
    jsonSchemaVersion: 'https://json-schema.org/draft-04/schema#'
}