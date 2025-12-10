const { Router } = require('express');
const { userAuth } = require("../middlewares/auth");

const requestsRouter = Router();

//Connection Request API
requestsRouter.post("/api/v0/sendConnectionRequest", userAuth, (req, res)=>{
  const user = req.user;
  res.send(user.firstName + " Sent the Connection Request")
})

module.exports = {requestsRouter}
