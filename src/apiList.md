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
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId

# usersRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed -> Gets you the profiles of users of the platform

Status: ignore, interested, accepted, rejected