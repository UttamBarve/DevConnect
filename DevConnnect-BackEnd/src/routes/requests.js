const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const {
  requestSendValidation,
  requestReviewValidation,
} = require("../utils/validation");
const User = require("../models/user");
const requestsRouter = Router();

//Connection Request API
requestsRouter.post(
  "/api/v0/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      // STATUS VALIDATION
      requestSendValidation(status);

      // toUserId VALIDATION
      const existingUser = await User.findById(toUserId);
      if (!existingUser) {
        throw new Error("User not Found!");
      }

      // EXISTING CONNECTION REQUEST VALIDATION
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Request Already Exists!");
      }

      // CREATING AND SAVING NEW DOCUMENT
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      // RESPONSE
      res.json({ message: "request sent successfull", data: data });
    } catch (err) {
      res.send("Request Send ERROR: " + err.message);
    }
  }
);

requestsRouter.post(
  "/api/v0/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // CONNER CASES:
      // SUNIL =INTERESTED=> NARENDRA
      // Check Status Validation /
      // Check Loggedin User  /
      // Check RequestId Validation /
      // CHECK EXISTING CONNECTION RESPONSE 
     
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      // VALIDATION: STATUS
      requestReviewValidation(status);

      // Validation: RequestId
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser
      });

      if (!connectionRequest) {
        return res.status(400).json({message: "Connection Request Not Exists"})
      }
      
      // CHANGING THE STATUS
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({message: `Request ${status} Succefully`, data: data});

    } catch (err) {
      res.send("Request Review ERROR: " + err.message);
    }
  }
);

module.exports = { requestsRouter };
