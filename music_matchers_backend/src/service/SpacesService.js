require("dotenv").config();
const { randomUUID } = require("crypto");
const sharp = require("sharp");
const AWS = require("aws-sdk");

const SPACES_BASE_URL =
    "https://music-matchers.nyc3.cdn.digitaloceanspaces.com/";
const { SPACES_PUBLIC_KEY, SPACES_PRIVATE_KEY, SPACES_NAME, SPACES_ENDPOINT } =
    process.env;

// Configure client for use with Spaces
const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: SPACES_PUBLIC_KEY,
    secretAccessKey: SPACES_PRIVATE_KEY,
});

const addImagesToSpace = async (currentUser, images) => {
    for (let i = 0; i < images.length; i++) {
        const uuid = randomUUID();
        const spliceIndex = images[i].originalname.indexOf(".");
        const randomizedKey = "images/".concat(
            uuid.concat(images[i].originalname.substring(spliceIndex))
        );
        const randomizedLazyKey = "images/".concat(
            uuid.concat(
                "-lazy".concat(images[i].originalname.substring(spliceIndex))
            )
        );

        const fullImage = await sharp(images[i].buffer)
            .resize({ width: 2000 })
            .toBuffer();
        const scaledDownImage = await sharp(images[i].buffer)
            .resize({ width: 20 })
            .toBuffer();

        //should probably make this an await
        s3.putObject(
            {
                ACL: "public-read",
                Bucket: SPACES_NAME,
                Key: randomizedKey,
                Body: fullImage,
            },
            async function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log(data);
            }
        );

        s3.putObject(
            {
                ACL: "public-read",
                Bucket: SPACES_NAME,
                Key: randomizedLazyKey,
                Body: scaledDownImage,
            },
            async function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log(data);
            }
        );

        currentUser.images.push(SPACES_BASE_URL.concat(randomizedKey));
    }
    await currentUser.save();
};

const addDemosToSpace = async (currentUser, demos) => {
    if (!currentUser.demos) {
        currentUser.demos = [];
    }

    for (let i = 0; i < demos.length; i++) {
        const uuid = randomUUID();
        const spliceIndex = demos[i].originalname.indexOf(".");
        const randomizedKey = "demos/".concat(
            uuid.concat(demos[i].originalname.substring(spliceIndex))
        );

        s3.putObject(
            {
                ACL: "public-read",
                Bucket: SPACES_NAME,
                Key: randomizedKey,
                Body: demos[0].buffer,
            },
            async function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log(data);
            }
        );

        currentUser.demos.push(SPACES_BASE_URL.concat(randomizedKey));
    }
    await currentUser.save();
};

module.exports = {
    addDemosToSpace,
    addImagesToSpace,
};
