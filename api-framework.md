*****NoSQL DATABASE STRUCTURE*****
Schema 1: users
	Param 1: user_id
	Param 2: username
	Param 3: nfc_tag
	Param 4: qr_code
  Subschema: friends
    Param 1: user_id
    Param 2: username
    Param 3: nfc_tag
    Param 4: qr_code
    Param 5: streak_length

*****API FRAMEWORK*****
/user/:username-:nfc_tag-:qr_code/ (POST + GET)
Creates user, generates and returns user_id

/users/:user_id/friends (GET)
Returns JSON array of friends

/user/:user_id/user (GET)
Returns a single user

/user/:user_id-:friend_id/add-friend (POST)
Friends add each other

/user/:user_id-:friend_id/add-streak (PUT)
Adds to the streak for a pair of friends

/user/:user_id-:friend_id/remove-streak (PUT)
Streak is destroyed
