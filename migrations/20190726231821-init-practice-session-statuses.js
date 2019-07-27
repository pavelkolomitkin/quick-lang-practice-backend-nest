module.exports = {
  async up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});


    await db.collection('practicesessionstatuses').insertOne({_id: 1, code: 'initialized', title: 'Initialized'});// User is calling
    await db.collection('practicesessionstatuses').insertOne({_id: 2, code: 'unAnswered', title: 'UnAnswered'});// User is calling
    await db.collection('practicesessionstatuses').insertOne({_id: 3, code: 'inProcess', title: 'In Process'});// User is calling
    await db.collection('practicesessionstatuses').insertOne({_id: 4, code: 'ended', title: 'Ended'});// User is calling


  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('practicesessionstatuses').drop();
  }
};
