*****NoSQL DATABASE STRUCTURE*****
Schema 1: user
	Param 1: user_id
	Param 2: username
	Param 3: pass_hashed
	Param 4: salt
	Param 5: nfc_tag
	Param 6: qr_code
  Subschema: friend
    Param 1: user_id
    Param 2: username
    Param 3: nfc_tag
    Param 4: qr_code
    Param 5: streak_length

*****API FRAMEWORK*****
		@GET("user/{user_id}")
    Gets user (Return empty if user_id doesn't exist)

    @GET("user/{user_id}/friends")
    Gets friends of a user (Return empty if user_id doesn't exist)

    @POST("user/{username}/{password_hashed}/{salt}/{nfc_tag}/create")
    Makes a user (Return user_id), generate a qr code BUT DON'T RETURN IT!

		@GET("user/{user_id}/get-qr")
		Gets the QR code from a user (Return -1 if user_id doesn't exist)

    @GET("user/{username}/get-salt")
    Gets a salt of user (Return -1 if username doesn't exist)

    @GET("user/{username}/{password_hashed}")
    Gets user_id and thus logs in a user (Return -1 if username doesn't exist or password_hashed is wrong)

    @GET("user/{username}/check-dupe")
    Tests if username exists already (1 if already exists, 0 if it doesn't)

    @GET("user/{user_id}/{nfc_tag}/add-friend")
    Adds a friend via nfc_tag (Return user_id of the friend, 0 if nfc_code doesn't exist)

		@GET("user/{user_id}/{qr_code}/add-friend")
    Adds a friend via qr_code (Return user_id of the friend, 0 if qr_code doesn't exist)

    @POST("user/{user_id}/{friend_id}/refresh-streak")
    Renews a streak

    @POST("user/{user_id}/{friend_id}/remove-streak")
    Destroys a streak
