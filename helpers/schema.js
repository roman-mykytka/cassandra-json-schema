const {
    isJson,
    isStringType,
    getJsonTypeFromData,
    getJsonTypeFromMetaData,
    getCassandraTypeByColumnType
} = require("./types");
const getObjectSchema = (object) => {
    const schema = {type: 'object'};
    const keys = Object.keys(object);
    if (keys.length > 0) {
        schema.properties = keys.reduce((target, fieldName) => {
            target[fieldName] = getSchema(object[fieldName]);
            return target;
        }, {});
    }
    return schema;
};

const getArrayFirstSchema = (arr) => {
  const schema = {type: 'array'};
  if (arr.length > 0) {
    schema.items = getSchema(arr[0])
  }
  return schema;
};

const getArrayAllSchemas = (arr) => {
  const schema = {type: 'array'};
  if (arr.length > 0) {
      schema.items = arr.map(item => getSchema(item));
  }
  return schema;
};

const getArraySchema = (arr, option = 'all') => {
  if (arr.length === 0) {
    return {type: 'array'};
  }
  switch (option) {
    case 'all':
      return getArrayAllSchemas(arr);
    case 'first':
      return getArrayFirstSchema(arr);
    default:
      throw new Error('Unknown option');
  }
};
const getSchema = (value, arraySchemaMode) => {
    const currentValue = value && isStringType(value) && isJson(value) ? JSON.parse(value) : value;
    const type = getJsonTypeFromData(currentValue);
    if (type === 'unknown') {
        throw new Error("Type of value couldn't be determined");
    }

    switch (type) {
        case 'object':
            return getObjectSchema(currentValue);
        case 'array':
            return getArraySchema(currentValue, arraySchemaMode);
        case 'string':
            return {type};
        default:
            return {type};
    }
};
const getJsonSchemaFromData = (jsonSchemaVersion, schemaTitle, schema) => {
    return {
        $schema: jsonSchemaVersion,
        title: schemaTitle,
        ...schema
    }
};

const getJsonSchemaFromMetaData = (jsonSchemaVersion, schemaTitle, metaData) => {
    const schema = {type: 'object'};
    schema.properties = metaData.columns.reduce((target, column) => {
        const columnType = getCassandraTypeByColumnType(column.type)
        target[column.name] = {type: getJsonTypeFromMetaData(columnType)}
        return target;
    }, {});

    return {
        $schema: jsonSchemaVersion,
        title: schemaTitle,
        ...schema
    }
};

module.exports = {
    getSchema,
    getArraySchema,
    getObjectSchema,
    getArrayAllSchemas,
    getArrayFirstSchema,
    getJsonSchemaFromData,
    getJsonSchemaFromMetaData,
}
