'use strict';
module.exports = function(app) {
    var tapstreak = require('../controllers/tapstreakControllers.js');
    // tapstreak Routes
    // CHANGE TO RELEVANT ONES!

    //debugging/upcheck
    app.route('/')
        .get(tapstreak.UpCheck);

    app.route('/user/create')
        // username, pass_hashed, salt passed in Body
        .post(tapstreak.CreateNewUser);

    app.route('/user/')
        // _id passed in Body
        .post(tapstreak.GetUserData);

    app.route('/user/id/')
        .post(tapstreak.GetUserId);

    app.route('/user/salt/:id/')
        .get(tapstreak.GetUserSalt);

    app.route('/user/checkdupe/:username')
        .get(tapstreak.CheckDuplicateUsername);

    app.route('/user/login/')
        .post(tapstreak.LoginUser);

    app.route('/user/friends/:id')
        .get(tapstreak.GetUserFriends);

};
