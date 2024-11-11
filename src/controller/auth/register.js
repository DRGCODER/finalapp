import db from "../../db/db_config.js";
import bcrypt from "bcryptjs";

export const registerUser = function (req, res) {
    try {
        const { username, password, userRole } = req.body;
        // TODO: validate content before registering => Done
        const passwordRegex = /^[a-zA-Z0-9!@#$%^&*-_]{8,50}$/;
        if (!username || !password || !userRole) {
            return res.status(400).json({
                blankFeils: "Missing required fields",
            });
        } else if (!passwordRegex.test(password)) {
            return res
                .status(400)
                .json({ password: "Invalid Password, Password Must BE 8 char Or More" });
        } else if (userRole !== "user" && userRole !== "admin") {
            return res.status(400).json({ userRole: "Invalid User Role Please Enter User Or Admin" });
        } else if (username.length < 4 && username.length > 50) {
            return res.status(400).json({ username: "Username must be at least 4 characters long and less than 50" });
        }
        else {
            const result = db.query(`SELECT * FROM users WHERE username = $1`, [username]);
            result.then((result) => {
                if (result.rows.length > 0) {
                    return res.status(400).json({ message: "Email already exist Try and Login" });
                } else {
                    bcrypt.hash(password, 10).then((hash) => {
                        const result = db.query(
                            `INSERT INTO users (username, password, userRole) VALUES ($1,$2,$3) RETURNING *`,
                            [username, hash, userRole]
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
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}