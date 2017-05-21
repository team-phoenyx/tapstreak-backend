'use strict';
module.exports = function(app) {
    var tapstreak = require('../controllers/tapstreakControllers.js');
    // tapstreak Routes
    // CHANGE TO RELEVANT ONES!
    app.route('/user/:user_id')
        .get(tapstreak.list_all_tasks)
        .post(tapstreak.create_a_task);

    app.route('/user/:taskId')
        .get(tapstreak.read_a_task)
        .put(tapstreak.update_a_task)
        .delete(tapstreak.delete_a_task);
};
