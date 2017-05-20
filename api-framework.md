*****NoSQL DATABASE STRUCTURE*****
Schema 1: user
	Param 1: user_id
	Param 2: username
	Param 3: nfc_tag
	Param 4: qr_code
  Subschema: friend
    Param 1: user_id
    Param 2: username
    Param 3: nfc_tag
    Param 4: qr_code
    Param 5: streak_length

*****API FRAMEWORK*****
@POST("user/{username}/{nfc_tag}/{qr_code}/create")
Creates a user

@GET("user/{user_id}")
Gets single user

@GET("user/{user_id}/friends")
Gets friends of user

@POST("user/{user_id}/{friend_id}/add-friend")
Adds a friend

@POST("user/{user_id}/{friend_id}/refresh-streak")
Refreshes a streak

@POST("user/{user_id}/{friend_id}/remove-streak")
Destroys a streak
