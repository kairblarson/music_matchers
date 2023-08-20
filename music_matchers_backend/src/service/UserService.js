const User = require("../models/User");
const Chatroom = require("../models/Chatroom");
const {
    calculateDistance,
    getUserCoords,
} = require("../service/LocationService");
const Message = require("../models/Message");
const BandInvite = require("../models/BandInvite");
const Band = require("../models/Band");

const handleBandRequest = async (recipientID, senderID, bandName) => {
    const recipient = await User.findById(recipientID);
    const sender = await User.findById(senderID);
    if (sender.band) {
        const invite = await BandInvite.create({
            accepted: false,
            to: recipient,
            from: sender,
            band: sender.band,
        });
    } else {
        const newBand = await Band.create({
            name: bandName,
            members: [sender],
        });

        sender.band = newBand;

        const invite = await BandInvite.create({
            accepted: false,
            to: recipient,
            from: sender,
            band: newBand,
        });

        recipient.bandInvites = [...recipient.bandInvites, invite];
    }

    await recipient.save();
    await sender.save();

    return "success";
};

const getBandInvites = async (recipientID) => {
    const currentUser = await User.findById(recipientID);
    const invites = await BandInvite.find({
        to: currentUser,
        declined: false,
        accepted: false,
    })
        .populate("band")
        .populate("from"); //add declined
    return invites;
};

const getBandRequestsStatus = async (currentUser, chatWithID) => {
    const from = await User.findById(currentUser._id);
    const to = await User.findById(chatWithID);
    const invites = await BandInvite.find({ from, to });

    if (invites.length > 0) return false; //false means invite sent
    else return true;
};

const handleLeaveBand = async (recipientID) => {
    //leave band logic
};

const declineBandRequest = async (requestID) => {
    const invite = await BandInvite.findById(requestID);
    invite.declined = true;
    await invite.save();

    //maybe return the new requests so we dont have to call it again and wait for two requests
    return "success";
};

const acceptBandRequest = async (requestID) => {
    const bandInvite = await BandInvite.findById(requestID);
    const currentUser = await User.findById(bandInvite.to);
    const band = await Band.findById(bandInvite.band);

    currentUser.band = band;
    bandInvite.accepted = true;
    bandInvite.declined = false;

    await currentUser.save();
    await bandInvite.save();

    return "success";
};

const getUnreadMessages = async (currentUser) => {
    //logic to get unread messages, return a num not an obj
    const unreadMessages = await Message.find({
        reciever: currentUser,
        viewedBy: { $nin: [currentUser] },
    }).limit(20);

    return unreadMessages.length;
};

const getLastViewed = async (currentUser) => {
    //if last viewed has the name of "user not found then get a suggestion"
    const lastViewed =
        currentUser.viewedUsers[currentUser.viewedUsers.length - 1];

    if (!lastViewed) {
        return await getSuggestion(currentUser);
    } else {
        const finalUser = await User.findById(lastViewed);
        if (finalUser.type == "error") {
            return await getSuggestion(currentUser);
        }
        return finalUser;
    }
};

const getUserProfile = async (currentUser, userId) => {
    const match = await User.findById(userId)
        .populate("band")
        .catch((err) => {
            console.log("could not find user with ID: ", userId);
            //do better error checking than this
            return {
                status: 404,
                message: `could not find user with ID: ${userId}`,
            };
        });
    const currentChatroom = await Chatroom.findOne({
        users: { $all: [currentUser, match] },
    }).catch((err) => console.log(err));

    if (currentChatroom == null) {
        return { status: 401, message: "unauthorized" }; //create an error module
    }

    return match;
};

//works as of now but not pretty
//and maybe lower the delay and maybe up the number of loops

const getSuggestion = async (currentUser) => {
    currentUser.radius = 1000; //DELETE FOR PROD OR PROD/TESTING
    await currentUser.save(); //DELETE FOR PROD OR PROD/TESTING

    let nextUser = [];
    let numOfLoops = 0;
    let outOfRadius = false;
    let distanceBetweenUsers = 0;

    while (nextUser.length == 0) {
        for (let i = 0; i < currentUser.genre.length; i++) {
            //still have to loop to check for viewed users BUT if we can figure out how to filter through viewed users then we are golden
            nextUser = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: currentUser._id },
                    },
                    $match: {
                        _id: { $ne: currentUser.viewedUsers },
                    },
                    $match: {
                        genre: { $in: currentUser.genre },
                    },
                    $match: {
                        type: { $in: currentUser.lookingFor },
                    },
                },
            ]).sample(1);
            if (
                nextUser.length > 0 &&
                currentUser._id != nextUser[0]._id &&
                !currentUser.viewedUsers.includes(nextUser[0]._id)
            ) {
                break;
            }
        }

        if (
            !nextUser ||
            (nextUser[0]?.type != "error" && nextUser.length > 0)
        ) {
            //determine if the sug is too far from user here
            const currentUserCoords = await getUserCoords(currentUser);
            const suggestedUserCoords = await getUserCoords(nextUser[0]);
            distanceBetweenUsers = await calculateDistance(
                currentUserCoords,
                suggestedUserCoords
            );
            if (distanceBetweenUsers > currentUser.radius) outOfRadius = true;
        }

        if (nextUser.length > 0) {
        }

        if (
            nextUser.length > 0 &&
            currentUser.email != nextUser[0].email &&
            !currentUser.viewedUsers.includes(nextUser[0]._id) &&
            !outOfRadius
        ) {
            //right before we send the user and do all the checks we determine if the user has
            //any swipes left, this will get a slower res if out of swipes but it works
            const result = await handleSwipeCount(currentUser);
            if (result == "swipe limit reached") {
                const lastViewed = await currentUser.viewedUsers[
                    currentUser.viewedUsers.length - 1
                ];
                const lastUser = await User.findById(lastViewed);
                lastUser.additionalInfo = "swipe limit reached";
                return lastUser;
            } else {
                if (currentUser.viewedUsers >= 20) {
                    currentUser.viewedUsers.pop();
                }
                await currentUser.viewedUsers.push(nextUser[0]);
                console.log("User added to viewed list");

                await currentUser.save();
                nextUser[0].distanceBetweenUsers = distanceBetweenUsers;

                return nextUser[0];
            }
        } else if (numOfLoops >= 5) {
            const result = await handleSwipeCount(currentUser);
            console.log("RESULT: ", result);
            if (result == "swipe limit reached") {
                const lastViewed = await currentUser.viewedUsers[
                    currentUser.viewedUsers.length - 1
                ];
                const lastUser = await User.findById(lastViewed);
                lastUser.additionalInfo = "swipe limit reached"; //this doesnt work if user doesnt have it
                return lastUser;
            }
            const userNotFound = await User.findById(
                "643abd5c7eebf5d0b43895d8"
            ); //specific "user not found" user

            if (
                currentUser.viewedUsers.length <= 0 ||
                currentUser.viewedUsers[currentUser.viewedUsers.length - 1]
                    ._id != "643abd5c7eebf5d0b43895d8"
            ) {
                //if currentUser.viewedUsers already contains user not found then take the prev one out maybe?
                currentUser.viewedUsers.push(userNotFound);
                await currentUser.save();
            }
            return userNotFound;
        } else {
            numOfLoops++;
            nextUser = [];
        }
        await delay(300);
    }
};

const handleSwipeCount = async (currentUser) => {
    //checking if user is out of swipes
    if (!currentUser.swipes) {
        currentUser.swipes = {
            numOfSwipes: 0,
            lastSwipedDate: new Date(),
        };
    } else if (
        currentUser.swipes.numOfSwipes >= 20 &&
        !currentUser.verified &&
        currentUser.swipes.lastSwipedDate.toDateString() ==
            new Date().toDateString()
    ) {
        console.log("SWIPE LIMIT REACHED");
        return "swipe limit reached";
    } else if (
        currentUser.swipes.numOfSwipes >= 100 &&
        currentUser.verified &&
        currentUser.swipes.lastSwipedDate.toDateString() ==
            new Date().toDateString()
    ) {
        return "swipe limit reached";
    }

    //adding a swipe
    currentUser.swipes.numOfSwipes += 1;

    //checking if if last swipe was on a different day
    if (
        currentUser.swipes.lastSwipedDate.toDateString() !=
        new Date().toDateString()
    ) {
        currentUser.swipes.numOfSwipes = 1;
        currentUser.swipes.lastSwipedDate = new Date();
    }
    await currentUser.save();

    //logging how many swipes a user has left
    if (currentUser.verified)
        console.log(
            `User still has ${
                100 - currentUser.swipes.numOfSwipes
            } swipes left.`
        );
    else
        console.log(
            `User still has ${20 - currentUser.swipes.numOfSwipes} swipes left.`
        );
};

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
    getSuggestion,
    getLastViewed,
    handleSwipeCount,
    getUnreadMessages,
    handleBandRequest,
    getBandInvites,
    handleLeaveBand,
    declineBandRequest,
    getUserProfile,
    getBandRequestsStatus,
    acceptBandRequest,
};
