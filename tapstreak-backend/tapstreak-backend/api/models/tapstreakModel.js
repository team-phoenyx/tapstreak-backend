'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({


    friends: [{ type: Schema.Types.ObjectId, ref: Friend }],
    became_friends: {
        type: Date,
        default: Date.now
    },
    // change:
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    }
});

var FriendSchema = new Schema({
    name: {
        type: String,
        Required: 'Kindly enter the name of the task'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    }
});

var Friend = mongoose.model('Friend', FriendSchema);
module.exports = mongoose.model('Users', UserSchema);
