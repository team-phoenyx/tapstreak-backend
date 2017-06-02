'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('Users');

exports.UpCheck = function (req, res) {
    res.send('API is up and running :)');
};

exports.CreateNewUser = function (req, res) {
    var newUser = new User(req.body);
    newUser.save(function (err, user) {
        if (err)
            res.send(err);
        res.json({ 'id': user._id });
    });
};
exports.GetUserData = function (req, res) {
    User.findById(req.body.id, function (err, userData) {
        if (err)
            res.send(err);
        res.json(userData);
    });
};
exports.GetUserId = function (req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err)
            res.send(err);
        res.json({ 'id': user._id });
    });
};


