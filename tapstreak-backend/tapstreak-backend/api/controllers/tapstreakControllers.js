'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('Users');

exports.list_all_users = function(req, res){
  User.find({}, function(err, User){
    if (err)
      res.send(err);
    res.json(User);
  });
};

exports.create_a_user = function(req, res){
  var new_user = new User(req.body);
  new_user.save(function(err, User){
    if (err)
      res.send(err);
    res.json(User);
  });
};

exports.read_a_user = function(req, res){
  User.findById(req.params.UserId, function(err, User) {
    if (err)
      res.send(err);
    res.json(User);
  });
};

exports.update_a_user = function(req, res){
  User.findOneAndUpdate(req.params.UserId, req.body, {new: true}, function(err, User){
    if (err)
      res.send(err);
    res.json(User);
  });
};

exports.delete_a_user = function(req, res){
  User.remove({
    _id: req.params.UserId
  },
    function(err, user) {
      if (err)
        res.send(err);
      res.json({message: 'User successfully deleted'});
    });
};
