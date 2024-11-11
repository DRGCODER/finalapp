import express from "express";
import passport from "passport";
import session from "express-session";
import config from "./src/config/config.js";
import userRouter from "./src/routes/authRoutes.js";
import todoRouter from "./src/routes/todos_Routes.js";
import cookieParser from "cookie-parser";
import axios from "axios";
import db from "./src/db/db_config.js";


const app = express();
// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(
    session({
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "strict",
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60, // 1 hour
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", userRouter, todoRouter);


app.listen(config.serverPort, () => {
    return console.log(`Server is running on port ${config.serverPort}`);
});
