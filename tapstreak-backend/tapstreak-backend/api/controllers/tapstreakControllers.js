'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('Users');

// Responds to initial GET request. 
exports.UpCheck = function (req, res) {
    res.send('API is up and running :)');
};

// Creates a new User object in the DB.
exports.CreateNewUser = function (req, res) {
    var newUser = new User(req.body);
    newUser.save(function (err, user) {
        if (err)
            res.send(err);
        res.json({ 'id': user._id });
    });
};

//Returns all of a user's data. 
//Problematic. '
exports.GetUserData = function (req, res) {
    User.findById(req.body.id, function (err, userData) {
        if (err)
            res.send(err);
        res.json(userData);
    });
};

//Returns an _id pertaining to a username.
//Implies that given username already exists.
exports.GetUserId = function (req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err)
            res.send(err);
        res.json({ 'id': user._id });
    });
};



//Checks if a certain username already exists. 
exports.CheckDuplicateUsername = function (req, res) {
    User.findOne({ username : req.params.username }, function (err, userExists) {
        if (err)
            res.send(err);
        if (userExists == null)
            res.json({ 'alreadyExists': 'false' });
        else
            res.json({ 'alreadyExists': 'true' });
    });
};

exports.GetUserSalt = function (req, res) {
    User.findOne({ _id : req.params.id }, function (err, user) {
        if (err)
            res.send(err);
        res.json({ 'salt' : user.salt });
    });
};

exports.GetUserFriends = function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (err)
            res.send(err);
        res.json({ friends : user.friends});
    });
};

exports.LoginUser = function (req, res) {
    User.findOne(({ username: req.body.username }, { pass_hashed: req.body.pass_hashed }), function (err, user) {
        if (err)
            res.send(err);
        if (user == null)
            res.json({ 'loginSuccessful': 'false' });
        else {
            res.json({ 'loginSuccessful': 'true', 'id': user._id });

        }
            
    });
};
