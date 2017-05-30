'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('Users');

exports.testGet = function (req, res) {
    res.json({message: 'Got a GET request!' });
};
exports.testPost = function (req, res) {
    res.json({ message: 'Got a POST request!' });
};

exports.CreateNewUser = function (req, res) {
    var newUser = new User(req.body);
    newUser.save(function (err, task) {
        if (err)
            res.send(err);
        res.json({ 'user_id': newUser._id });
    });
};
exports.GetUserData = function (req, res) {
    User.findById(req.params.user_id, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
}


