'use strict';
module.exports = function(app) {
  var tapstreakController = require("./controllers.js");

  //PING ENDPOINT
  app.get("/api/ping/", function (req, res) {
    res.json("pong");
  });
//USER CREATION AND LOGIN
  app.route("/api/user/create/")
    .post(tapstreakController.userCreate);
  app.route("/api/user/salt/")
    .post(tapstreakController.userGetSalt);
  app.route("/api/user/login/")
    .post(tapstreakController.userLogin);
  app.route("/api/user/delete/")
    .post(tapstreakController.userDelete);

//USER INFO ENDPOINTS
  app.route("/api/user/personal/")
    .post(tapstreakController.userPersonal);
  app.route("/api/user/public/")
    .post(tapstreakController.userPublic);


/* Copyright © 2017 */
