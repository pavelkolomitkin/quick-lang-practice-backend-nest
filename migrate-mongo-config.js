// In this file you can configure migrate-mongo
const dbConfig = require('./src/config/mongo-config');

const config = {
  mongodb: {

    url: dbConfig.uri,

    databaseName: dbConfig.options.dbName,

    options: dbConfig.options
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog"
};

//Return the config as a promise
module.exports = config;
