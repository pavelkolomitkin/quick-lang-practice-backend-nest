module.exports = {
  async up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
      await db.collection('languagelevels').insertOne({ _id: 1, title: 'Beginner', code: 'beginner', level: 0 });
      await db.collection('languagelevels').insertOne({ _id: 2, title: 'Elementary', code: 'elementary', level: 1 });
      await db.collection('languagelevels').insertOne({ _id: 3, title: 'Intermediate', code: 'intermediate', level: 2 });
      await db.collection('languagelevels').insertOne({ _id: 4, title: 'Advanced', code: 'advanced', level: 3 });
      await db.collection('languagelevels').insertOne({ _id: 5, title: 'Native', code: 'native', level: 4 });
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
      await db.collection('languagelevels').drop();
  }
};
