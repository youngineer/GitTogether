# GitTogether API

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH prifile/password

# connectionRequestRouter
- POST /request/send/:status/:userId -> status = ["interested", "ignored"]

- POST /request/review/:status/:requesterId -> status = "interested"

# usersRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed -> Gets you the profiles of users of the platform

Status: ignore, interested, accepted, rejected