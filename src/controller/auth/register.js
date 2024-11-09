import db from "../../db/db_config.js";
import bcrypt from "bcryptjs";

export const registerUser = function (req, res) {
    const { username, password, userRole } = req.body;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*-_]{8,50}$/;
    if (!username || !password) {
        return res.status(400).json({
            blankFeils: "Missing required fields",
        });
    } else if (!passwordRegex.test(password)) {
        return res
            .status(400)
            .json({ password: "Invalid Password, Password Must BE 8 char Or More" });
    } else {
        const result = db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        result.then((result) => {
            if (result.rows.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
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
}