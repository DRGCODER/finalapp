import express from "express";
import passport from "passport";
import session from "express-session";
import config from "./src/config/config.js";
import cors from "cors";
import userRouter from "./src/routes/authRoutes.js";
import todoRouter from "./src/routes/todos_Routes.js";



const corsOptions = {
    origin: ["http://localhost:3000"], // replace with the frontend URL
    credentials: true,
};
const app = express();
// Middleware
app.use(cors(corsOptions));
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
app.use("/api", userRouter, todoRouter)

app.listen(config.serverPort, () => {
    return console.log(`Server is running on port ${config.serverPort}`);
});
