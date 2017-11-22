'use strict';
//dependencies
const request = require("request-promise");
const hat = require("hat");

//mongodb stuff
const models = require("./schemas.js");
const mongoose = require("mongoose"),
Users = mongoose.model('Users');

exports.checkUsernameExists = function(req, res) {
  if (req.body.username == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }

  Users.count({username: req.body.username}, function(err, count) {
    if (err) res.json({"resp_code": "1", "resp_msg": "Failed to query Users collection"});
    else {
      if (count > 0) {
        res.json({"resp_code": "2", "resp_msg": "Username exists"});
      } else {
        res.json({"resp_code": "100", "resp_msg": "Username is unique"});
      }
    }
  });
}

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
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
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
  Users.findOne({_id: req.body.user_id, access_token: req.body.access_token, pass_hashed: req.body.pass_hashed}, function(err, user) {
    if (err || user == null) {
      res.json({"resp_code": "1", "resp_msg": "User could not be found: " + err});
      return;
    }
    var friends = user.friends;
    //Iterate through every friend, remove this user from his/her friends' friend lists
    for (var i = 0; i < friends.length; i++) {
      var friendID = friends[i]._id;
      Users.findOne({_id: friendID}, function (err, friend) {
        if (!err) {
          friend.friends.splice({_id: user._id}, 1);
          friend.save(function (err, friend) {});
        } else {
          res.json({"resp_code": "1", "resp_msg": "meme me up" + err});
        }
      });
    }

    Users.remove({_id: req.body.user_id, access_token: req.body.access_token, pass_hashed: req.body.pass_hashed}, function (err, user) {
      if (err || user == null) res.json({"resp_code": "1", "resp_msg": "userDelete failed: " + err});
      else {
        res.json({"resp_code": "100", "resp_msg": "User deleted"});
      }
    });
  });
};

exports.userChangePw = function(req, res) {
  if (req.body.user_id == null || Users.findOne({_id: req.body.username}) == null) {
    res.json({"resp_code": "1", "resp_msg": "Invalid user_id/non-existant user ..."});
    return;
  }
  var a_t = hat();
  Users.update({_id: req.body.user_id, access_token: req.body.access_token, pass_hashed: req.body.pass_hashed}, {pass_hashed: req.body.new_pass_hashed, salt: req.body.new_salt, access_token: a_t}, function (err, user) {
    if (err || user == null) res.json({"resp_code": "2", "resp_msg": "userChangePw failed: " + err});
    else {
      res.json({resp_code: "100", resp_msg: "Password changed successfully!"});
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

exports.removeFriend = function(req, res) {
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
          user.friends.splice({_id: req.body.friend_id}, 1);
          friend.friends.splice({_id: user._id}, 1);
          user.save(function (err, user) {
            if (err) {
              res.json({"resp_code": "1", "resp_msg": "Saving user failed: " + err});
              return;
            }
            else {
              friend.save(function (err, friend) {
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
  });
}

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

          var youFriend = {
            user_id: req.body.user_id,
            username: user.username,
            streak_length: 1,
            last_streak: Date.now()
          }

          user.friends.push(newFriend);
          friend.friends.push(youFriend);
          user.save(function (err, user) {
            if (err) {
              res.json({"resp_code": "1", "resp_msg": "Saving user failed: " + err});
              return;
            }
            else {
              friend.save(function (err, friend) {
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
              if (Date.now() - user.friends[i].last_streak < 57600000) {
                res.json({"resp_code": "100", "resp_msg": "Cannot refresh too early"});
                return;
              }
              user.friends[i].streak_length = user.friends[i].streak_length + 1;
              user.friends[i].last_streak = Date.now();
              break;
            }
          }
          for (var i = 0; i < friend.friends.length; i++) {
            if (friend.friends[i].user_id == req.body.user_id) {
              friend.friends[i].streak_length = friend.friends[i].streak_length + 1;
              friend.friends[i].last_streak = Date.now();
              break;
            }
          }

          user.save(function (err, user) {
            if (err) {
              res.json({"resp_code": "1", "resp_msg": "Saving user failed: " + err});
              return;
            }
            else {
              friend.save(function (err, friend) {
                if (err) {
                  res.json({"resp_code": "1", "resp_msg": "Saving user failed: " + err});
                  return;
                } else {
                  res.json({"resp_code": "100"});
                }
              });

            }
          });
        }
      });
    }
  });
}



/* Copyright © 2017 */
