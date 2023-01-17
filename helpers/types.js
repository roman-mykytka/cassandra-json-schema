const cassandra = require('cassandra-driver');
const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

const isArray = (value) => Array.isArray(value) || value instanceof Array;
const isObject = (value) => typeof value === 'object' && !Array.isArray(value) && value !== null;

const isStringType = (value) => typeof value === 'string' || value instanceof String;
const isString = (value) => isStringType(value) || value instanceof Date;
const isNumber = (value) => typeof value === 'number' && !isNaN(value);
const isInteger = (value) => isNumber(value) && value % 1 === 0;
const isNull = (value) => value === null || value === undefined;
const isBoolean = (value) => typeof value === 'boolean';
const getJsonTypeFromData = (value) => {
    if (isArray(value)) {
        return 'array';
    } else if (isString(value)) {
        return 'string';
    } else if (isObject(value)) {
        return 'object';
    // } else if (isInteger(value)) {
    //     return 'integer';
    } else if (isNumber(value)) {
        return 'number';
    } else if (isNull(value)) {
        return 'null';
    } else if (isBoolean(value)) {
        return 'boolean';
    } else return 'unknown';
};

const getCassandraTypeByColumnType = (columnType) => {
    const {types} = cassandra;
    return types.getDataTypeNameByCode(columnType);
}

// cassandra types https://cassandra.apache.org/doc/latest/cassandra/cql/types.html
const getJsonTypeFromMetaData = (type) => {
    switch (type) {
        case "ascii":
        case "blob":
        case "date":
        case "inet":
        case "text":
        case "time":
        case "timestamp":
        case "timeuuid":
        case "varchar":
        case "uuid":
            return 'string';
        case "bigint":
        case "counter":
        case "decimal":
        case "double":
        case "float":
        case "int":
        case "smallint":
        case "tinyint":
        case "varint":
            return 'number';
        case "list":
        case "set":
        case "tuple":
            return 'array';
        case "map":
            return 'object';
        case "boolean":
            return 'boolean';
        default:
            return 'string';
    }
};

module.exports = {
    isNull,
    isJson,
    isArray,
    isObject,
    isNumber,
    isInteger,
    isString,
    isBoolean,
    isStringType,
    getJsonTypeFromData,
    getJsonTypeFromMetaData,
    getCassandraTypeByColumnType,
}