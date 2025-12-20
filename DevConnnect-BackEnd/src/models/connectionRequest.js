const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    status:{
        type: String,
        require: true,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is not a valid value!`
        }
    },
},
    {timestamps:true}
);

// Compound index:
connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save", function(next){
    // const connectionRequest = this;
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
 
module.exports = ConnectionRequest;