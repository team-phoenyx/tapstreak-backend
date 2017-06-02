'use strict';
var express = require('express'),
    app = express(),
    port = process.env.PORT || 1337,
    mongoose = require('mongoose'),
    User = require('./api/models/tapstreakModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://phoenyx-tapstreak:154vbqmXwtlRyxFKFCug7QrQGh57LycZdtjgkHuzJDpO4UOgGlKGD04EHMdYszEJwqffIitmXxqX8oPNGiXK0g==@phoenyx-tapstreak.documents.azure.com:10255/?ssl=true&replicaSet=globaldb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // connected to DB
    console.log('connected to phoenyx-tapstreak DB!');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/tapstreakRoutes');
routes(app);

app.listen(port);
var tag = 'BASICFUNCS';
console.log('tapstreak API running on port ' + port);
console.log('version 0.4.06012017 - VERSION TAG: ' + tag);
