const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Band = require("../models/Band");
const UserVerificationToken = require("../models/UserVerificationToken");
const { hashPassword, comparePassword } = require("../utils/helper");
const { addNewCustomer } = require("../service/StripeService");
const {
    addImagesToSpace,
    addDemosToSpace,
} = require("../service/SpacesService");
const passport = require("passport");
const multer = require("multer");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const multiUpload = upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audios", maxCount: 10 },
]);

router.post("/login", passport.authenticate("local"), async (req, res) => {
    if (!req.user.stripeId) {
        const { user } = req;
        const customer = await addNewCustomer(req.user.email, req.user.name);
        user.stripeId = customer.id;
        await user.save();
    }
    res.send(req.user);
});

router.post("/register/user", multiUpload, async (req, res) => {
    //split this into its own function goofy
    let {
        type,
        name,
        email,
        city,
        state,
        lookingFor,
        genre,
        band,
        link,
        genres,
    } = req.body;

    if (
        type == "Select" ||
        !name ||
        !email ||
        !city ||
        !state ||
        lookingFor.length <= 0 ||
        genres.length <= 0
    ) {
        res.status(200).send({ message: "please fill out all the fields" });
    } else if (req.files.images.length > 3) {
        res.status(200).send({ message: "3 image limit" });
    } else {
        let word = "";
        const finalGenres = [];
        const finalLookingFor = [];

        for (let i = 0; i < genres.length; i++) {
            if (genres[i] == ",") {
                finalGenres.push(
                    word
                        .replace("[", "")
                        .replace("]", "")
                        .replace(/"/g, "")
                        .toLowerCase()
                );
                word = "";
            } else {
                word = word.concat(genres[i]);
                if (i == genres.length - 1) {
                    finalGenres.push(
                        word
                            .replace("[", "")
                            .replace("]", "")
                            .replace(/"/g, "")
                            .toLowerCase()
                    );
                    word = "";
                }
            }
        }

        for (let i = 0; i < lookingFor.length; i++) {
            if (lookingFor[i] == ",") {
                finalLookingFor.push(
                    word
                        .replace("[", "")
                        .replace("]", "")
                        .replace(/"/g, "")
                        .toLowerCase()
                );
                word = "";
            } else {
                word = word.concat(lookingFor[i]);
                if (i == lookingFor.length - 1) {
                    finalLookingFor.push(
                        word
                            .replace("[", "")
                            .replace("]", "")
                            .replace(/"/g, "")
                            .toLowerCase()
                    );
                    word = "";
                }
            }
        }

        const userDB = await User.findOne({ email });

        if (userDB) {
            res.status(200).send({
                message: "user with those credentials already exists",
            });
        } else {
            const password = hashPassword(req.body.password);
            type = type.toLowerCase();
            const newUser = await User.create({
                type,
                name,
                password,
                email,
                location: {
                    city,
                    state,
                },
                lookingFor: finalLookingFor,
                genre: finalGenres,
                band: null,
                images: [],
                demos: [],
                swipes: {
                    numOfSwipes: 0,
                },
                radius: 500,
            });

            await addImagesToSpace(newUser, req.files.images);
            await addDemosToSpace(newUser, req.files.audios);
            res.status(201).send({ user: newUser });
        }
    }
});

router.get("/verify-user", async (req, res) => {
    const user = await User.findById(req.user._id);
    const { verificationToken } = req.query;
    const token = await UserVerificationToken.where("token").equals(
        `${verificationToken}`
    );
    if (token) {
        user.verified = true;
        console.log(token);
        //delete the token here, tried the token.deleteOne() method but it didnt work for some reason
        await user.save();

        res.redirect(`${process.env.CLIENT_URL}/profile?verified=true`);
    } else {
        res.send(404);
    }
});

router.post("/register/band", async (req, res) => {
    if (!req.user) res.send(401);
    else {
        const { name, email, location, lookingFor, genre, images, link, type } =
            req.body;

        const bandDB = await Band.where("name").equals(`${name.toLowerCase()}`);
        const user = req.user;

        if (bandDB.length > 0) {
            res.status(400).send({
                message: "Band with those credentials already exists",
            });
        } else {
            const password = hashPassword(req.body.password);
            const newBand = await User.create({
                name,
                password,
                email,
                location,
                lookingFor,
                genre,
                images,
                link,
                type,
            });
            newBand.members = [user];
            newBand.save();
            res.status(201).send({ band: newBand });
        }
    }
});

//-----------test enpoints------------
router.post("/image-upload/test", multiUpload, async (req, res) => {
    await addImagesToSpace(null, req.files.images);
    res.send(200);
});

module.exports = router;
