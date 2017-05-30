'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    pass_hashed: String,
    salt: String,
    friends: [{ type: Schema.Types.ObjectId, ref: Friend, default: null}]
},
    {
        versionKey: false
    });

var FriendSchema = new Schema({
    username: String,
    streak_length: {
        type: Number,
        default: 0
    },
    first_tapped: Date,
    last_tapped: Date
},
    {
        versionKey: false
    });

var Friend = mongoose.model('Friend', FriendSchema);
module.exports = mongoose.model('Users', UserSchema);
