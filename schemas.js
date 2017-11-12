'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  access_token: String,
  username: String,
  pass_hashed: String,
  salt: String,
  friends: [{
    user_id: String,
    username: String,
    streak_length: Number,
    last_streak: Number
    // last_streak is a timestamp*
  }]
});

module.exports = mongoose.model('Users', UserSchema);
