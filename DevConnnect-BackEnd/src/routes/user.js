const { Router } = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = Router();
const publicData = "firstName lastName age gender photoUrl about skills"

userRouter.get("/api/v0/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", publicData);
    // }).populate("fromUserId", "firstName lastName age gender photoUrl about skills"); -< also pass it as string

    if (requests.length < 1) {
      return res.send("You Don't Have Any Requests");
    }

    const data = requests.map((item) => item.fromUserId);

    res.send(data);
  } catch (err) {
    res.send("Get Request ERROR: ", err.message);
  }
});


userRouter.get("/api/v0/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequest.find({
      $or: [
        { toUserId: user._id, status: "accepted" },
        { fromUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", publicData)
      .populate("toUserId", publicData);
    // }).populate("fromUserId", "firstName lastName age gender photoUrl about skills"); -< also pass it as string

    if (requests.length < 1) {
      return res.send("You Don't Have Any Connections");
    }
    const data = requests.map((item) => {
      if (item.toUserId._id.equals(user._id)) {
        return item.fromUserId;
      } else {
        return item.toUserId;
      }
    });

    res.send(data);
  } catch (err) {
    res.send("Get Request ERROR: ", err.message);
  }
});


userRouter.get("/api/v0/user/feed", userAuth, async (req, res) => {
  
  // give users make connection suggestions 
  // validation:
  // shouldn't show interested/ignored/requested/connected/OWN user
  // only show user's public details
  // only show 10 profile a time
  // 
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;
    const user = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or:[
        {fromUserId : user._id},
        {toUserId : user._id}
      ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    hideUsersFromFeed.add(user._id.toString());

    connectionRequests.forEach((req)=>{
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    
    const users = await User.find({
      _id : {$nin: Array.from(hideUsersFromFeed)}
    }).select(publicData).skip(skip).limit(limit);  

    res.send(users);

  } catch (err) {
    res.send("Get Request ERROR: ", err.message);
  }
});

module.exports = { userRouter };
