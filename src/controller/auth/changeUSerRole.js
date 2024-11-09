import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const changeUserRole = function (req, res) {
    const id = parseInt(req.query.id);
    const userRole = req.body.userRole;
    const token = req.headers.authorization?.split(" ")[1];
    if (!userRole || !id) {
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
                .json({
                    message: "You don't have permission to change user role user",
                });
        } else {
            const result = db.query(
                `UPDATE users SET userrole=$1 WHERE id=$2 RETURNING *`,
                [userRole, id]
            );
            result.then((user) => {
                res.json({
                    status: "User Role Updated Sucseccfully",
                    data: user.rows[0],
                });
            });
        }
    });
};
