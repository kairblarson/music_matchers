require("dotenv").config();
const { randomUUID } = require("crypto");

const secret_key = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(secret_key);
const UserVerificationToken = require("../models/UserVerificationToken");

const addNewCustomer = async (email, name) => {
    const customer = await stripe.customers.create({
        email,
        description: name,
    });
    return customer;
};

const getCustomerByID = async (id) => {
    const customer = await stripe.customers.retrieve(id);
    return customer;
};

const createCheckoutSession = async (user) => {
    const verificationToken = randomUUID();
    await UserVerificationToken.create({ token: verificationToken });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer: getCustomerByID(user.stripeId),
            line_items: [
                {
                    price: process.env.SUBSCRIPTION_FEE,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.SERVER_URL}/api/v1/auth/verify-user?verificationToken=${verificationToken}`,
            cancel_url: `${process.env.CLIENT_URL}/profile`,
        });

        return { url: session.url };
    } catch (e) {
        console.log(e.message);
        return { error: e.message, status: 500 };
    }
};

module.exports = {
    addNewCustomer,
    getCustomerByID,
    createCheckoutSession,
};
