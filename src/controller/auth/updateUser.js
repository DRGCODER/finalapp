import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";
import bcrypt from "bcryptjs";

env.config();

export const updateUser = function (req, res) {
    const id = parseInt(req.query.id);
    const usernamereq = req.body.username;
    const password = req.body.password;
    const userRole = req.body.userRole;
    const token = req.headers.authorization?.split(" ")[1];
    if (!userRole || !id || !usernamereq || !password) {
        return res.status(400).json({
            blankFeils: "Missing required fields",
        });
    }
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        const { role, username } = decoded;
        if (role !== "admin" && username === undefined) {
            return res
                .status(403)
                .json({ message: "You don't have permission to update user" });
        }
        // TODO: validate content before updating
        bcrypt.hash(password, 10).then((hash) => {
            const result = db.query(
                `UPDATE users SET username=$1, password=$2, userrole=$3 WHERE id=$4 RETURNING *`,
                [usernamereq, hash, userRole, id]
            );
            result.then((result) => {
                return res.json({
                    message: "User Updated Sucssecfully",
                    data: result.rows[0],
                });
            });
        });
    });
};
