'use strict';
var express = require('express'),
    app = express(),
    port = process.env.PORT || 430,
    mongoose = require('mongoose'),
    Task = require('./api/models/tapstreakModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://phoenyx-tapstreak:154vbqmXwtlRyxFKFCug7QrQGh57LycZdtjgkHuzJDpO4UOgGlKGD04EHMdYszEJwqffIitmXxqX8oPNGiXK0g==@phoenyx-tapstreak.documents.azure.com:10255/?ssl=true&replicaSet=globaldb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/todoListRoutes');
routes(app);

app.listen(port);
var tag = 'CODEDAY';
console.log('tapstreak API running on port' + port);
console.log('version 0.1.5202017 - VERSION TAG: ' + tag);
