'use strict';
module.exports = function(app) {
  var tapstreakController = require("./controllers.js");

  //PING ENDPOINT
  app.get("/api/ping/", function (req, res) {
    res.json("pong");
  });
//USER CREATION/DELETION AND LOGIN
  app.route("/api/user/unexists/")
    .post(tapstreakController.checkUsernameExists);
  app.route("/api/user/create/")
    .post(tapstreakController.userCreate);
  app.route("/api/user/salt/")
    .post(tapstreakController.userGetSalt);
  app.route("/api/user/login/")
    .post(tapstreakController.userLogin);
  app.route("/api/user/delete/")
    .post(tapstreakController.userDelete);
  app.route("/api/user/cpw/")
    .post(tapstreakController.userChangePw);

//USER INFO ENDPOINTS
  app.route("/api/user/personal/")
    .post(tapstreakController.userPersonal);
  app.route("/api/user/public/")
    .post(tapstreakController.userPublic);

//FRIEND ENDPOINTS
  app.route("/api/user/rfriend/")
    .post(tapstreakController.removeFriend);
  app.route("/api/user/afriend/")
    .post(tapstreakController.addFriend);
  app.route("/api/user/rfstreak/")
    .post(tapstreakController.refreshStreak);
}
/* Copyright © 2017 */
