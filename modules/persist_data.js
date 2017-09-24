'use strict';
// set up ======================================================================
var MongoClient = require('mongodb').MongoClient;

// load config ======================================================================
var databaseConfig = require('./config/database'); 		// load the database config


module.exports = {
  save: function (data) {

    let _data = data;

    // Connect to the db
    MongoClient.connect(databaseConfig.localUrl, function (err, db) {
      // Handle the error
      if (err) {
        console.error(Date() + 'connection to database failed' + err);
        db.close();
      }
      else {
        console.log('Connect to database sucessful');

        // Get the documents collection
        let collection = db.collection(databaseConfig.collection);

        collection.insert(_data);

        db.close();
      };
    });

    return true;

  },
  stop: function () {

  }
};

