const express = require("express");
const { urlencoded, json } = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const WebSocket = require("ws");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 8081;
const wss = new WebSocket.Server({ server: server });

require("./strategies/local");
require("./config/dbConfig");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const bandRoutes = require("./routes/bandRoutes");

const limiter = rateLimit({
    windowMs: 60 * 60 * 250,
    max: 1000,
    message: "You have exceeded the rate limit, try again later...",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

wss.on("connection", function connection(ws, req) {
    console.log("New client connected");

    ws.on("message", function incoming(data, isBinary) {
        const message = isBinary ? data : data.toString();
        // console.log("recieved: %s", message);

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 900000 },
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017/music_matchers_db",
        }),
    })
);

app.use((req, res, next) => {
    console.log(req.method, ":", req.path);
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bands", bandRoutes);
app.use("/api/v1/auth", authRoutes);

server.listen(PORT, () => console.log("Server running on port: ", PORT));

//gut everything to do with band, its one user but they can have many types
//DO what maddy suggested by having a board where people can signup to do shows **
