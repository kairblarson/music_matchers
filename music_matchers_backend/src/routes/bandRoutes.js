const express = require("express");
const Band = require("../models/Band");
const router = express.Router();

// router.use((req, res, next) => {
//     if (req.user) next();
//     else res.send(401);
// });

router.get("/", async (req, res) => {
    const allBands = await Band.find({});
    res.send(allBands);
});

router.get("/suggestions", async (req, res) => {
    const sug = await Band.findById("");
    //create a service mod that will query a bunch of diff bands/musicians
    res.send(sug);
});

router.get("/:id", async (req, res) => {
    const sug = await Band.findById(req.params.id).populate("members");

    res.send(sug);
});

module.exports = router;
