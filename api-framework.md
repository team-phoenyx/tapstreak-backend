*****NoSQL DATABASE STRUCTURE*****
Schema 1: user
	Param 2: username
	Param 3: pass_hashed
	Param 4: salt
  Subschema: friend
    Param 1: id
    Param 2: username
    Param 3: streak_length
		Param 4: last_streak
		Param 5: streak_start

*****API FRAMEWORK*****

		@POST("/user/") **DONE**
    Gets user based on id (Return empty if id doesn't exist)
		**NOTE:** Changed to POST from GET.

		@POST("/user/{username}")
		Gets user id based on username (Return empty is id doesn't exist.

    @GET("/user/friends/{id}")    
		Gets friends of a user (Return empty if id doesn't exist or if no friends).
		**NOTE:** Returns a list of ids.

    @POST("/user/create/") **DONE**
    Makes a user (Return id)
			{
				"id":"2"
			}
    @POST("/user/get-salt")
    Gets a salt of user based on id (Return -1 if username doesn't exist)
			{
				"salt":"ajsdnfasdf"
			}
		**NOTE:** Changed to POST from GET.

    @POST("/user/login/{username}/{pass_hashed}")
    Gets id and thus logs in a user (Return -1 if username doesn't exist or pass_hashed is wrong)
		**NOTE:** Changed to POST from GET.

    @GET("user/{username}/check-dupe")
    Tests if username exists already ("true" if already exists, "false" if it doesn't)
			{
				"alreadyExists":"true"
			}

    @POST("user/add-friend/{id1}/{id2}")
    Adds a friend via nfc_tag (Return id of the friend)
		**NOTE:** Removed return 0 if NFC tag doesn't exist. NFC tag can't not exist.

    @POST("user/refresh-streak/{id}/{friend_id}")
    Renews a streak
		**NOTE:** Adds +1 to the streak parameter.

    @POST("user/remove-streak/{id}/{friend_id}")
    Destroys a streak
		**NOTE:** Sets streak parameter to 0.
