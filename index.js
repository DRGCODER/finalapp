import express from "express";
import passport from "passport";
import session, { Cookie } from "express-session";
import config from "./config/config.js";
import pg from "pg";
import bcrypt from "bcryptjs";

// database configuration
const db = new pg.Client({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
});
db.connect().then(() => {
    console.log("Connected to database");
});

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/users", (req, res) => {
    console.log(req.user);
    try {
        if (req.isAuthenticated) {
            const result = db.query(`SELECT * FROM fusers`);
            result.then((users) => {
                return res.json({
                    message: "Users Fetched Sucssecfully",
                    data: users.rows,
                });
            });
        } else {
            return res.status(401).json({ message: "User Not Logged In" });
        }
    } catch (e) {
        return res.status(500).json({ message: "Error fetching users", error: e });
    }
});
app.post("/api/user-regester", (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const age = req.body.age;
    const bio = req.body.bio;
    const emailRegex = /^[a-zA-Z0-9!#*-_]+@[a-z]+\.[a-z]{2,20}$/;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*-_]{8,50}$/;
    const ageRegex = /^[1-9][0-9]*$/;
    if (!name || !password || !email || !age || !bio) {
        return res.status(400).json({
            blankFeils: "Missing required fields",
        });
    } else if (!emailRegex.test(email)) {
        return res.status(400).json({ email: "Invalid Email" });
    } else if (!passwordRegex.test(password)) {
        return res
            .status(400)
            .json({ password: "Invalid Password, Password Must BE 8 char Or More" });
    } else if (!ageRegex.test(age)) {
        return res.status(400).json({ age: "Invalid Age, Age Must Be  A Number" });
    } else {
        const result = db.query(`SELECT * FROM fusers WHERE email = $1`, [email]);
        result.then((result) => {
            if (result.rows.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            } else {
                bcrypt.hash(password, 10).then((hash) => {
                    const result = db.query(
                        `INSERT INTO fusers (email, password, name,age,bio) VALUES ($1, $2,$3,$4,$5) RETURNING *`,
                        [email, hash, name, age, bio]
                    );
                    result.then((result) => {
                        return res.json({
                            message: "User Created Sucssecfully",
                            data: result.rows[0],
                        });
                    });
                });
            }
        });
    }
});
app.post("/api/user-login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const emailRegex = /^[a-zA-Z0-9!#*-_]+@[a-z]+\.[a-z]{2,20}$/;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*-_]{8,50}$/;
    console.log(email, password);
    try {
        if (!emailRegex.test(email)) {
            return done(null, false, { email: "Invalid Email" });
        } else if (!passwordRegex.test(password)) {
            return done(null, false, {
                password: "Invalid Password, Password Must BE 8 char Or More",
            });
        } else {
            const result = db.query(`SELECT * FROM fusers WHERE email = $1`, [email]);
            result.then((user) => {
                bcrypt.compare(password, user.rows[0].password).then((isMatch) => {
                    if (isMatch) {
                        res.cookie("Name", "Express BackEnd", {
                            httpOnly: true,
                            secure: true,
                            maxAge: 3600000,  // 1 hour
                            sameSite: 'Strict'
                        }),
                            res.json({
                                Status: "Cookiw Sent Sucssefully"
                            }),
                            (err) => {
                                if (err) {
                                    return res.json({ message: "Login Failed" });
                                }
                                return res.json({
                                    message: "Login Succeeded",
                                    data: user.rows[0],
                                });
                            };
                    } else {
                        return res.json({ message: "Invalid Credentials" });
                    }
                });
            });
        }
    } catch (err) {
        return done(err);
    }
});
app.get("/api/user-profile", (req, res) => {
    if (req.isAuthenticated) {
        return res.json({
            message: "User Logged In Sucssecfully",
            user: req.user,
        });
    } else {
        return res.status(401).json({ message: "User Not Logged In" });
    }
});
app.delete("/api/delete-user", (req, res) => {
    const id = parseInt(req.query.id);
    const result = db.query(`DELETE FROM fusers WHERE id = $1 RETURNING *`, [id]);
    result.then((result) => {
        return res.json({
            message: "User Deleted Sucssecfully",
            data: result.rows,
        });
    });
});
app.put("/api/update-user", (req, res) => {
    const id = parseInt(req.query.id);
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const age = req.body.age;
    const bio = req.body.bio;
    bcrypt.hash(password, 10).then((hash) => {
        const result = db.query(
            `UPDATE fusers SET email=$1, password=$2, name=$3, age=$4, bio=$5 WHERE id=$6 RETURNING *`,
            [email, hash, name, age, bio, id]
        );
        result.then((result) => {
            return res.json({
                message: "User Updated Sucssecfully",
                data: result.rows[0],
            });
        });
    });
});

app.listen(config.serverPort, () => {
    return console.log(`Server is running on port ${config.serverPort}`);
});
