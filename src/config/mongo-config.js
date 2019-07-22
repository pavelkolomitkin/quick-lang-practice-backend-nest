module.exports = {
    uri: 'mongodb://mongodb-service:' + process.env.MONGO_DATABASE_PORT + '/' + process.env.MONGO_INITDB_DATABASE,

    options: {
        useNewUrlParser: true,
        replicaSet: process.env.MONGO_REPLICASET,
        autoIndex: false,
        poolSize: 200,
        useFindAndModify: false
    },

    databaseName: process.env.MONGO_INITDB_DATABASE
};
