module.exports = {
    uri: 'mongodb://'
    + process.env.MONGO_INITDB_ROOT_USERNAME + ':'
    + process.env.MONGO_INITDB_ROOT_PASSWORD
    + '@mongodb-service:' + process.env.MONGO_DATABASE_PORT,

    options: {
        useNewUrlParser: true,
        dbName: process.env.MONGO_INITDB_DATABASE,
        autoIndex: false
    },
};
