'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  access_token: String,
  username: {
    type: String,
    unique: true
  },
  pass_hashed: String,
  salt: String,
  last_seen_time: Number, //timestamp
  last_seen_lat: Number,
  last_seen_lon: Number,
  friends: [{
    user_id: String,
    username: String,
    // last_streak is a timestamp*
  }]
  streaks: [{
    user_id: String,
    username: String,
    streak_length: Number,
    last_streak: Number
  }]
});

module.exports = mongoose.model('Users', UserSchema);
