const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { USER_SAFE_DATA } = require("../utils/constants");
const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async(req, resp) => {
    try {
        const loggedInUser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "skills"]);

        if(pendingRequests.length === 0) {
            return resp.status(404).json({
                message: "No pending requests available",
                data: []
            });
        };


        resp.status(200).json({
            message: "Pending requests available",
            body: pendingRequests
        });

    } catch(err) {
        throw new Error("Something went wrong: " + err.message);
    }
});


userRouter.get("/user/connections", userAuth, async (req, resp) => {
    const loggedInUser = req.user;

    try {
        const acceptedConnections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        if (acceptedConnections.length === 0) {
            return resp.status(404).json({
                message: "No connections established yet"
            });
        }

        const data = await Promise.all(
            acceptedConnections.map(async (row) => {
                if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return await User.findById(row.toUserId);
                }
                return await User.findById(row.fromUserId);
            })
        );


        resp.status(200).json({
            message: "Your Connections",
            body: data
        });
    } catch (error) {
        console.error(error); 
        resp.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});


userRouter.get("/user/feed", userAuth, async(req, resp) => {
    try {
        const loggedInUser = req.user;
        const loggedInUserId = loggedInUser._id;
        const page = req.query.page || 1;
        const limit = req.query.limit || 2;
        const skips = (page - 1) * 2;

        const nonAvailableProfiles = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select("fromUserId toUserId");

        const hideProfiles = new Set();
        nonAvailableProfiles.forEach((profile) => {
            hideProfiles.add(profile.fromUserId.toString());
            hideProfiles.add(profile.toUserId.toString());
        });

        const profilesToFeed = await User.find({
            _id: {
                $nin: Array.from(hideProfiles),
                $ne: loggedInUser._id
            }
        })
        .skip(skips)
        .limit(limit);

        resp.status(200).json({
            message: "Users for the feed",
            data: profilesToFeed
        });


    } catch(err) {
        throw new Error("Something went wrong: " + err.message);
    }
});



module.exports = userRouter;