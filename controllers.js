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

exports.reauthenticate = function(req, res) {
  if (req.body.user_id == null || req.body.access_token == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }

  User.findOne({_id: req.body.user_id, access_token: req.body.access_token}, function(err, user) {
    if (err || user == null) {
      res.json({"resp_code": "2", "resp_msg": "User could not be found: " + err});
      return;
    }

    user.access_token = hat();
    user.save(function (err, updatedUser) {
      if (err) res.json({"resp_code": "1", "resp_msg": "Updating access token failed..." + err});
      else {
        res.json({"resp_code": "100", "resp_msg": updatedUser.access_token});
      }
    });
  });
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
      var friendID = friends[i].user_id;
      Users.findOne({_id: friendID}, function (err, friend) {
        if (!err && friend != null) {
          friend.friends.splice({user_id: user._id}, 1);
          friend.streaks.splice({user_id: user._id}, 1);
          friend.save(function (err, friend) {});
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
  if (req.body.user_id == null || req.body.access_token == null || req.body.pass_hashed == null || req.body.new_pass_hashed == null || req.body.new_salt == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }
  var a_t = hat();
  Users.update({_id: req.body.user_id, access_token: req.body.access_token, pass_hashed: req.body.pass_hashed}, {pass_hashed: req.body.new_pass_hashed, salt: req.body.new_salt, access_token: a_t}, function (err, user) {
    if (err || user == null) res.json({"resp_code": "2", "resp_msg": "userChangePw failed: " + err});
    else {
      res.json({"resp_code": "100", "resp_msg": a_t});
    }
  });
};

exports.userChangeUn = function(req, res) {
  if (req.body.user_id == null || req.body.access_token == null || req.body.new_username == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }
  Users.update({_id: req.body.user_id, access_token: req.body.access_token}, {username: req.body.new_username}, function(err, newUser) {
    if (err || newUser == null) res.json({"resp_code": "1", "resp_msg": "userChangeUsername failed: " + err});
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
      var counter = 0;
      var newFriends = [];
      var getFriendCallback = function (friendFull) {
        if (!err && friendFull != null) {
          var newFriend = {
            username: friendFull.username,
            user_id: friendFull._id,
            last_seen_time: friendFull.last_seen_time,
            last_seen_lat: friendFull.last_seen_lat,
            last_seen_lon: friendFull.last_seen_lon
          };
          newFriends.push(newFriend);
        }
        counter++;
        if (counter == user.friends.length) {
          var newUser = {
            _id: user._id,
            username: user.username,
            streaks: user.streaks,
            friends: newFriends.slice(0)
          };
          res.json(newUser);
        }
      };
      for (var i = 0; i < user.friends.length; i++) {
        var friend = user.friends[i];
        Users.findOne({_id: friend.user_id}, function (err, friendFull) {
          getFriendCallback(friendFull);
        });
      }
      if (user.friends.length == 0) {
        var newUser = {
          _id: user._id,
          username: user.username,
          streaks: [],
          friends: []
        };
        res.json(newUser);
      }
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
      user.friends.splice({user_id: req.body.friend_id}, 1);
      user.streaks.splice({user_id: req.body.friend_id}, 1);
      user.save(function (err, user) {
        if (err) {
          res.json({"resp_code": "1", "resp_msg": "Saving user failed: " + err});
          return;
        } else {
          res.json({"resp_code": "100"});
        }
      });

      Users.findOne({_id: req.body.friend_id}, function (err, friend){
        if (err || friend == null) {
          return;
        } else {
          friend.friends.splice({user_id: user._id}, 1);
          friend.streaks.splice({user_id: user._id}, 1);
          friend.save(function (err, friend) {});
        }
      });
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
            username: friend.username
          };

          var newStreak = {
            user_id: req.body.friend_id,
            username: friend.username,
            streak_length: 1,
            last_streak: Date.now()
          };

          var youFriend = {
            user_id: req.body.user_id,
            username: user.username
          };

          var youStreak = {
            user_id: req.body.user_id,
            username: user.username,
            streak_length: 1,
            last_streak: Date.now()
          };

          user.friends.push(newFriend);
          user.streaks.push(newStreak);
          friend.friends.push(youFriend);
          friend.streaks.push(youStreak);

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
};

exports.setLocation = function(req, res) {
  if (req.body.user_id == null || req.body.access_token == null || req.body.time == null || req.body.lat == null || req.body.lon == null) {
    res.json({"resp_code": "1", "resp_msg": "Null parameter(s)"});
    return;
  }

  Users.update({_id: req.body.user_id, access_token: req.body.access_token}, {last_seen_time: req.body.time, last_seen_lat: req.body.lat, last_seen_lon: req.body.lon}, function(err, newUser) {
    if (err || newUser == null) res.json({"resp_code": "1", "resp_msg": "setLocation failed: " + err});
    else {
      res.json({"resp_code": "100"});
    }
  });
};

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
          for (var i = 0; i < user.streaks.length; i++) {
            if (user.streaks[i].user_id == req.body.friend_id) {
              if (Date.now() - user.streaks[i].last_streak < 43200000) {
                res.json({"resp_code": "100", "resp_msg": "Cannot refresh too early"});
                return;
              }
              user.streaks[i].streak_length = user.streaks[i].streak_length + 1;
              user.streaks[i].last_streak = Date.now();
              user.streaks[i].updatedAt.expires = null;
              user.streaks[i].updatedAt = Date.now();
              user.streaks[i].updatedAt.expires = '28h';
              break;
            }
          }
          for (var i = 0; i < friend.streaks.length; i++) {
            if (friend.streaks[i].user_id == req.body.user_id) {
              friend.streaks[i].streak_length = friend.streaks[i].streak_length + 1;
              friend.streaks[i].last_streak = Date.now();
              friend.streaks[i].updatedAt.expires = null;
              friend.streaks[i].updatedAt = Date.now();
              friend.streaks[i].updatedAt.expires = '28h';
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
};



/* Copyright © 2017 */
