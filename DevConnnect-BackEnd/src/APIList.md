Auth:
Done-> POST /signup   
Done-> POST /login
Done-> POST /logout

user:
    -> GET /user/feed
    -> GET /user/connection
    -> GET /user/requests

profile:
Done-> GET /profile/view
    -> PATCH /profile/edit
    -> POST /profile/password

request:
    -> POST /request/send/interested/:userId
    -> POST /request/send/ignored/:userId
    -> POST /request/review/accepted/:requestId
    -> POST /request/review/rejected/:requestId

    



Thought Process for Creating API:

POST /profile/edit/password:
    -> Check Auth
    -> Get the Id from body.user and the current password
    -> Get the current password with req.body.password
    -> Compare both password using descryption or built in function
    -> if same then encrypt new password and update it

POST /profile/forgotPassword/sendOTP:
    -> Get the user email from req.body
    -> Check if user exists
    -> Generate an OTP
    -> Set OTP and its expiry time
    -> tempolarly save the OTP in db 
    -> //(const otp = Math.floor(100000 + Math.random() * 900000);)
    -> //(const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min)
    -> Sent to User's email

POST /profile/forgotPassword/verifyOTP:
    -> Get the email from req.body
    -> Get OTP and expiry time 
    -> check OTP and expiry time
    -> update password


