'use strict';
//dependencies
const request = require("request-promise");
const hat = require("hat");

//mongodb stuff
const models = require("./schemas.js");
const mongoose = require("mongoose"),
Users = mongoose.model('Users');

exports.userCreate = function(req, res) {
 if (req.body.username == null || req.body.pass_hashed == null || req.body.salt == null){
   res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
   return;
 }

 var a_t = hat();
 var newUser = Users({username: req.body.username, pass_hashed: req.body.pass_hashed, salt: req.body.salt, access_token: a_t});
 newUser.save(function (err, user) {
   if (err) res.json({"resp_code": "1", "resp_msg": "userCreate failed: " + err});
   else {
     res.json({"resp_code": "100", "user_id": user._id, "access_token": user.access_token});
   }
  });
}

exports.userGetSalt = function(req, res) {
  if (req.body.username == null) {
    res.json({"resp_code": "1", "resp_msg": "Invalid username/non-existant user..."});
    return;
  }
  Users.findOne({username: req.body.username}, 'salt', function (err, salt) {
    if (err || salt == null) res.json({"resp_code": "1", "resp_msg": "userGetSalt failed: " + err});
    else {
      res.json(salt);
    }
  });
};

exports.userLogin = function(req, res) {
  if (req.body.username == null || req.body.pass_hashed == null) {
    res.json({"resp_code": "1", "resp_msg": "Invalid username/non-existant user..."});
    return;
  }
  else {
    Users.findOne({username: req.body.username}, function (err, user) {
      if (err) {
        res.json({"resp_code": "1", "resp_msg": "Invalid username/non-existant user..."});
        return;
      }
      if (req.body.pass_hashed != user.pass_hashed){
        res.json({"resp_code": "2", "resp_msg": "Incorrect password..."});
        return;
      }
      else {
        //MAY BE BUGGY?
        Users.findOne({username: req.body.username, pass_hashed: req.body.pass_hashed}, function (err, user) {
          if (err || user == null) {
            res.json({"resp_code": "1", "resp_msg": "User could not be found to update token" + err});
            return;
          }
          user.access_token = hat();
          user.save(function (err, updatedUser) {
            if (err) res.json({"resp_code": "1", "resp_msg": "Updating access token failed..." + err});
            else {
              res.json({"resp_code": "100", "user_id": updatedUser._id, "access_token": updatedUser.access_token});
            }
          });
        });
      }
    });

};
}

exports.userDelete = function(req, res) {
  if (req.body.user_id == null || req.body.access_token == null || req.body.pass_hashed == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }
  Users.remove({_id: req.body.user_id, access_token: req.body.access_token, pass_hashed: req.body.pass_hashed}, function (err, user) {
    if (err || user == null) res.json({"resp_code": "1", "resp_msg": "userDelete failed: " + err});
    else {
      res.json({"resp_code": "100"});
    }
  });
};

exports.userPersonal = function(req, res) {
  if (req.body.user_id == null || Users.findOne({_id: req.body.user_id}) == null) {
    res.json({"resp_code": "1", "resp_msg": "Invalid user_id/non-existant user ..."});
    return;
  }
  if (req.body.access_token == null || Users.findOne({access_token: req.body.access_token}) == null) {
    res.json({"resp_code": "2", "resp_msg": "Invalid access_token..."});
    return;
  }
  Users.findOne({_id: req.body.user_id, access_token: req.body.access_token}, function (err, user) {
    if (err || user == null) res.json({"resp_code": "1", "resp_msg": "userPersonal failed: " + err});
    else {
      res.json(user);
    }
  });
};

exports.userPublic = function(req, res) {
  if (req.body.user_id == null || Users.findOne({_id: req.body.user_id}) == null) {
    res.json({"resp_code": "1", "resp_msg": "Invalid user_id/non-existant user ..."});
    return;
  }

  Users.findOne({_id: req.body.user_id}, 'username', function (err, user) {
    if (err || user == null) res.json({"resp_code": "1", "resp_msg": "userPublic failed: " + err});
    else {
      res.json(user);
    }
  });
};

exports.addFriend = function(req, res) {
  if (req.body.user_id == null || req.body.friend_id == null || req.body.access_token == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }

  Users.findOne({_id: req.body.user_id, access_token: req.body.access_token}, function (err, user) {
    if (err || user == null) {
      res.json({"resp_code": "1", "resp_msg": "User non-existent, or access_token incorrect"});
      return;
    } else {
      Users.findOne({_id: req.body.friend_id}, function (err, friend){
        if (err) {
          res.json({"resp_code": "2", "resp_msg": "Friend non-existent"});
          return;
        } else {
          var newFriend = {
            user_id: req.body.friend_id,
            username: friend.username,
            streak_length: 1,
            last_streak: Date.now()
          };

          user.friends.push(newFriend);
          user.save(function (err, user) {
            if (err) {
              res.json({"resp_code": "1", "resp_msg": "Saving user failed: " + err});
              return;
            }
            else {
              res.json({"resp_code": "100"});
            }
          });
        }
      });
    }
  });
}

exports.refreshStreak = function(req, res) {
  if (req.body.user_id == null || req.body.friend_id == null || req.body.access_token == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }

  Users.findOne({_id: req.body.user_id, access_token: req.body.access_token}, function (err, user) {
    if (err || user == null) {
      res.json({"resp_code": "1", "resp_msg": "User non-existent, or access_token incorrect"});
      return;
    } else {
      Users.findOne({_id: req.body.friend_id}, function (err, friend){
        if (err) {
          res.json({"resp_code": "2", "resp_msg": "Friend non-existent"});
          return;
        } else {
          for (var i = 0; i < user.friends.length; i++) {
            if (user.friends[i].user_id == req.body.friend_id) {
              user.friends[i].streak_length = user.friends[i].streak_length + 1;
              user.friends[i].last_streak = Date.now();
              break;
            }
          }
          user.save(function (err, user) {
            if (err) {
              res.json({"resp_code": "1", "resp_msg": "Saving user failed: " + err});
              return;
            }
            else {
              res.json({"resp_code": "100"});
            }
          });
        }
      });
    }
  });
}



/* Copyright © 2017 */
