require("dotenv").config();
const fetch = require("node-fetch");

const calculateDistance = async (startingCoords, destinationCoords) => {
    let startingLat = await degreesToRadians(startingCoords.latitude);
    let startingLong = await degreesToRadians(startingCoords.longitude);
    let destinationLat = await degreesToRadians(destinationCoords.latitude);
    let destinationLong = await degreesToRadians(destinationCoords.longitude);

    // Radius of the Earth in kilometers
    let radius = 6571;

    // Haversine equation
    let distanceInKilometers =
        Math.acos(
            Math.sin(startingLat) * Math.sin(destinationLat) +
                Math.cos(startingLat) *
                    Math.cos(destinationLat) *
                    Math.cos(startingLong - destinationLong)
        ) * radius;

    return distanceInKilometers * 0.621371;
};

const degreesToRadians = async (degrees) => {
    const radians = (degrees * Math.PI) / 180;
    return radians;
};

const getUserCoords = async (user) => {
    //make geocode api to get the coords given the city and state
    const { GEOCODE_API_KEY } = process.env;
    const userCoords = {
        latitude: null,
        longitude: null,
    };

    //sometimes this will throw an error if its called too often and if that happens deal with the error
    await fetch(
        `https://api.tomtom.com/search/2/geocode/${user.location.city} ${user.location.state}.json?key=${GEOCODE_API_KEY}`
    )
        .then((res) => res.json())
        .then((data) => {
            userCoords.latitude = data.results[0].position.lat;
            userCoords.longitude = data.results[0].position.lon;
        })
        .catch((err) => console.log(err));

    return userCoords;
};

module.exports = {
    calculateDistance,
    getUserCoords,
};
