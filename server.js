var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

//MONGODB
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/tapstreakDP', { useMongoClient: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
      console.log("MongoDB is connected!");
  });
//ROUTES
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var routes = require("./routes.js");
  routes(app);
//LOGGING
  app.listen(port);
  console.log("TAPSTREAK API is live.");

  /* Copyright © 2017 */
