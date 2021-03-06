var conn = new Mongo();
var db = conn.getDB("tapstreakDP");

function iterate() {
  print("Mongo Script: Iteration");
  var cursor = db.users.find();

  while (cursor.hasNext()) {
    var thisUser = cursor.next();
    var userStreaks = thisUser.streaks;
    for (var j = 0; j < userStreaks.length; j++) {
      if (Date.now() - userStreaks[j].last_streak > 100800000) { //remove streak
        print("Mongo Script: Removing streak");
        var friend = db.users.findOne({"username": userStreaks[j].username});
        for (var k = 0; k < friend.streaks.length; k++) {
          if (friend.streaks[k].user_id == thisUser.id) {
            friend.streaks.splice(k, 1);
            db.users.save(friend);
            break;
          }
        }
        userStreaks.splice(j, 1);
        thisUser.streaks = userStreaks;
        db.users.save(thisUser);
      }
    }
  }

  sleep(1000);
  iterate();
}

function sleep(millis) {
  var start = Date.now();
  while (true) {
    if (Date.now() - start > millis) break;
  }
}
iterate();
