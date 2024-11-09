import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const patchT = function (req, res) {
    const id = parseInt(req.query.id);
    const isCompleted = req.body.isCompleted;
    const token = req.headers.authorization?.split(" ")[1];
    if (!id) {
        return res.status(400).json({
            blankFeils: "Missing required fields",
        });
    }
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        const result = db.query(
            `UPDATE todo SET isCompleted=$1 WHERE id=$2 RETURNING *`,
            [isCompleted, id]
        );
        result.then((todo) => {
            res.json({
                status: "User Role Updated Sucseccfully",
                data: todo.rows[0],
            });
        });
    });
};
