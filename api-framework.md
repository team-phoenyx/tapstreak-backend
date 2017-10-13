*****NoSQL DATABASE STRUCTURE*****
Schema 1: user
	Param 1: user_id (needed for friend identification)
	Param 2: access_token (needed for user commands)
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

		@POST("/user-verbose/") **DONE**
		Gets user based on user_id and access_token

		Response codes:
			1 if id doesn't exist
			2 if access_token is incorrect

		Parameters: user_id, access_token
		Response Structure:

		{
			resp_code: "",
			username: "",
			friends: [
				{
					id: "",
					username: "",
					streak_length: "",
					last_streak: "",
					streak_start: ""
				},
				{
					id: "",
					username: "",
					streak_length: "",
					last_streak: "",
					streak_start: ""
				}
			]
		}

    @POST("/user-short/") **DONE**
		Gets user profile (excluding friends) based on user_id (access_token is NOT needed)

		Response codes:
			1 if id doesn't exists

		Parameters: user_id
		Response Structure:

		{
			resp_code: "",
			username: ""
		}

    @POST("/user/create/") **DONE**
    Registers a new user

		Response codes:
			1: Username is duplicate

		Parameters: username, pass_hashed, salt

		Response Structure:

		{
			"resp_code": "",
			"user_id": ""
		}

    @POST("/user/get-salt") **DONE**
    Gets a salt of user based on username during login

		Response codes:
			1: Username doesn't exist

		Parameters: username

		Response Structure:

		{
			"resp_code": "",
			"salt": ""
		}

    @POST("/user/login/") **DONE**
    Gets user_id and access_token, thus logging in a user given the correct username and pass_hashed

		Response codes:
			1: Username doesn't exist
			2: Pass_hashed is incorrect

		Parameters: username, pass_hashed

		Response Structure:

		{
			"resp_code": "",
			"user_id": ""
		}

    @POST("user/add-friend/")
    Adds a friend via user_id (can be obtained via qr or nfc); MUST BE DONE ON BOTH USER OBJECTS! THIS WILL ONLY BE CALLED ONCE FROM ONE USER!

		Response codes:
			1: user_id or friend_id doesn't exist
			2: access_token is incorrect
			3: The users are already friends (yes, check for duplicate friends!)

		Parameters: user_id, access_token, friend_id

		Response Structure:

		{
			"resp_code": ""
		}

    @POST("user/refresh-streak/")
    Renews a streak; +1 on streak counter if sufficient time has passed, refresh last_streak to current timestamp
		MUST BE DONE ON BOTH USER OBJECTS! THIS WILL ONLY BE CALLED ONCE FROM ONE USER!

		Response codes:
			1: user_id or friend_id doesn't exist
			2: access_token is incorrect

		Parameters: user_id, access_token, friend_id

		Response Structure:

		{
			"resp_code": ""
		}

********RESPONSE CODE********

100:	General success
1:		General failure
