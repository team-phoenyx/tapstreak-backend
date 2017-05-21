*****NoSQL DATABASE STRUCTURE*****
Schema 1: user
	Param 1: user_id
	Param 2: username
	Param 3: pass_hashed
	Param 4: salt
  Subschema: friend
    Param 1: user_id
    Param 2: username
    Param 4: streak_length

*****API FRAMEWORK*****
		@GET("user/{user_id}")
    Gets user (Return empty if user_id doesn't exist)

    @GET("user/{user_id}/friends")
    Gets friends of a user (Return empty if user_id doesn't exist)

    @GET("user/{username}/{password_hashed}/{salt}/create")
    Makes a user (Return user_id)

			{
				"user_id":"2"
			}

    @GET("user/{username}/get-salt")
    Gets a salt of user (Return -1 if username doesn't exist)

			{
				"salt":"ajsdnfasdf"
			}

    @GET("user/{username}/{password_hashed}")
    Gets user_id and thus logs in a user (Return -1 if username doesn't exist or password_hashed is wrong)

    @GET("user/{username}/check-dupe")
    Tests if username exists already ("true" if already exists, "false" if it doesn't)

			{
				"alreadyExists":"true"
			}

    @GET("user/{user_id}/{user_id}/add-friend")
    Adds a friend via nfc_tag (Return user_id of the friend, 0 if nfc_code doesn't exist)

    @POST("user/{user_id}/{friend_id}/refresh-streak")
    Renews a streak

    @POST("user/{user_id}/{friend_id}/remove-streak")
    Destroys a streak
