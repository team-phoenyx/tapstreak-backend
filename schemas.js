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
    username: String
  }],
  streaks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }]
});

var StreakSchema = new Schema({
  streak_length: Number, //streak counter
  last_streak: Number, //timestamp
  expireAt: {
    type: Date,
    default: undefined
  }
});

StreakSchema.index({"expireAt": 1}, {expireAfterSeconds: 0});

module.exports = mongoose.model('Users', UserSchema);
