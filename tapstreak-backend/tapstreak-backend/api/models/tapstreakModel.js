'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    pass_hashed: String,
    salt: String,
    qr_code: String,
    streak_length: Number,
    friends: [{ type: Schema.Types.ObjectId, ref: Friend }]

    //became_friends: {
    //    type: Date,
    //    default: Date.now
    //}
});

var FriendSchema = new Schema({
    username: String,
    qr_code: String,
    streak_length: Number

});

var Friend = mongoose.model('Friend', FriendSchema);
module.exports = mongoose.model('Users', UserSchema);
