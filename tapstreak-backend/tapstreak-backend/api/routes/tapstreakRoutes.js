'use strict';
module.exports = function(app) {
    var tapstreak = require('../controllers/tapstreakControllers.js');
    // tapstreak Routes
    // CHANGE TO RELEVANT ONES!

    //debug autism
    app.route('/')
        .get(tapstreak.testGet)
        .post(tapstreak.testPost);

    app.route('/user/create')
        .post(tapstreak.CreateNewUser);

    app.route('/user/')
        .post(tapstreak.GetUserData);
};
