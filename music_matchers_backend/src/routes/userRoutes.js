const express = require("express");
const User = require("../models/User");
const {
    getSuggestion,
    getLastViewed,
    getUnreadMessages,
    getUserProfile,
    handleBandRequest,
    getBandInvites,
    getBandRequestsStatus,
    acceptBandRequest,
    handleLeaveBand,
    declineBandRequest,
} = require("../service/UserService");
const {
    handleMessage,
    getAllChatrooms,
    getCurrentChatroom,
    declineChatRequest,
} = require("../service/ChatService");
const { createCheckoutSession } = require("../service/StripeService");
const { addImagesToSpace } = require("../service/SpacesService");
const router = express.Router();
const multer = require("multer");
const fetch = require("node-fetch");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const multiUpload = upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audios", maxCount: 10 },
]);

//change this to a get because you are not altering the DB
router.post("/current-location", async (req, res) => {
    const { GEOCODE_API_KEY } = process.env;
    const { LATITUDE, LONGITUDE } = req.body;
    let currentLocation = {
        city: null,
        state: null,
    };

    await fetch(
        `https://api.tomtom.com/search/2/reverseGeocode/${LATITUDE},${LONGITUDE}.json?key=${GEOCODE_API_KEY}&radius=100`
    )
        .then((res) => res.json())
        .then((data) => {
            currentLocation.state =
                data.addresses[0].address.countrySubdivision;
            currentLocation.city = data.addresses[0].address.municipality;
        });

    res.send(currentLocation);
});

//checks if user is logged in
router.use((req, res, next) => {
    if (req.user) next();
    else res.send(401);
});

router.post("/accept-band-request", async (req, res) => {
    const result = await acceptBandRequest(req.body.requestID);

    res.send({ status: 200, result });
});

router.post("/decline-band-request", async (req, res) => {
    const result = await declineBandRequest(req.body.requestID);

    res.send(result);
});

router.post("/edit-profile", multiUpload, async (req, res) => {
    addImagesToSpace(req.user, req.files.images);
    res.send(200);
});

router.get("/user-details", async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate("band");
    res.send(currentUser);
});

router.get("/", async (req, res) => {
    const allUsers = await User.find({});
    res.send(allUsers);
});

router.get("/subscribe", async (req, res) => {
    const result = await createCheckoutSession(req.user);
    res.send(result);
});

router.get("/last-viewed", async (req, res) => {
    const lastViewed = await getLastViewed(req.user);
    res.send(lastViewed);
});

router.get("/next-user", async (req, res) => {
    const suggestion = await getSuggestion(req.user);

    res.send(suggestion);
});

router.get("/band-requests", async (req, res) => {
    const invites = await getBandInvites(req.user);

    res.send(invites);
});

router.post("/band-request-status", async (req, res) => {
    const status = await getBandRequestsStatus(req.user, req.body.chatWith);

    res.send(status);
});

//next work on the logic for creating bands/inviting others to bands
//and linking a band to users
router.post("/band-request", async (req, res) => {
    const { band: requestedBand, receiver } = req.body;
    const result = await handleBandRequest(receiver, req.user, requestedBand);
    //the front end logic should be all set, now just do the backend

    res.send({ status: 200, result });
});

router.get("/messages/unread", async (req, res) => {
    const unreadMessages = await getUnreadMessages(req.user);
    res.send({ unreadMessages });
});

router.post("/send-message", async (req, res) => {
    const message = {
        sender: req.user,
        reciever: req.body.reciever,
        content: req.body.content,
    };
    const result = await handleMessage(message);

    if (result == "OK") res.send({ status: 201 });
    else res.send({ status: 400, message: result });
});

router.get("/chatroom/:chatroomId", async (req, res) => {
    const currentChatroom = await getCurrentChatroom(
        req.user,
        null,
        req.params.chatroomId,
        req.query.page
    );

    res.send(currentChatroom);
});

router.get("/chatroom/:chatroomId/declined", async (req, res) => {
    await declineChatRequest(req.params.chatroomId);
    const chatrooms = await getAllChatrooms(req.user, req.query.accepted);
    res.send(chatrooms);
});

router.get("/chatrooms", async (req, res) => {
    const allChatrooms = await getAllChatrooms(req.user, req.query.accepted);

    res.send(allChatrooms);
});

router.get("/:id", async (req, res) => {
    const match = await getUserProfile(req.user, req.params.id);
    res.send(match);
});

module.exports = router;
