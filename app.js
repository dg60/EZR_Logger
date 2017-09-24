'use strict';
// set up ======================================================================
var MongoClient  = require('mongodb').MongoClient;
var logger       = require('./modules/logger_temp.js');
var save_data = require('./modules/persist_data.js');

// load config ======================================================================
var config = require('./config/config.json');


// Handle errors ======================================================================
process.on('uncaughtException', (err) => {

  var timestamp = new Date();

  // Stop modules
  logger.stop();
  save_data.stop();

  // Log the error
  console.error(err + ' ' + timestamp);
  console.error(err);
  // Kill the process
  process.exit(1);
});

// Global ======================================================================
var dataEZR = [];
var datasaved = false;


//=======================
// Looger Loop
//=======================
setInterval(function () {

    if (datasaved) {
        dataEZR = [];   // clear buffer
        datasaved = false;
    }

    dataEZR = logger.start(dataEZR);

}, config.logger );

//=======================
// Save Loop
//=======================
setInterval(function () {

   datasaved = save_data.save(dataEZR);

}, config.persist );






