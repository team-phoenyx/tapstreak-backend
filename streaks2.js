var conn = new Mongo();
var db = conn.getDB("tapstreakDP");

while (true) {
  print("iterate");

  var cursor = db.users.find();

  while (cursor.hasNext()) {
    var thisUser = cursor.next();
    var userStreaks = thisUser.streaks;
    for (var j = 0; j < userStreaks.length; j++) {
      if (Date.now() - userStreaks[j].last_streak > 30000) { //remove streak
        print("remove streak");
        var friend = db.users.findOne({"username": userStreaks[j].username});
        for (var k = 0; k < friend.streaks.length; k++) {
          if (friend.streaks[k].user_id == thisUser.id) {
            friend.streaks.splice(k, 1);
            friend.save();
            break;
          }
        }
        userStreaks.splice(j, 1);
        thisUser.streaks = userStreaks;
        thisUser.save();
      }
    }
  }
}
/*
var iterate = function() {
  print("iterate");
  db.users.find({streaks: {$exists: true, $ne: []}}, function (err, users) {
    if (err) {
      print(err);
      return;
    }
    print("find iteration");
    for (var i = 0; i < users.length; i++) {
      var thisUser = users[i];
      var userStreaks = thisUser.streaks;
      for (var j = 0; j < userStreaks.length; j++) {
	if (Date.now() - userStreaks[j].last_streak > 30000) { //remove streak
	  print("remove streak");
	  db.users.find({_id: userStreaks[j].user_id}, function(err, friend){
	    for (var k = 0; k < friend.streaks.length; k++) {
	      if (friend.streaks[k].user_id == thisUser.id) {
		friend.streaks.splice(k, 1);
		friend.save();
                break;
	      }
	    }
	  });

	  userStreaks.splice(j, 1);
	  thisUser.streaks = userStreaks;
	  thisUser.save();
	}
      }
    }
    iterate();
  });
}
print("test");
iterate();
*/
