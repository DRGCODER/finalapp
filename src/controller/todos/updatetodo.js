import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const updateT = function (req, res) {
    const id = parseInt(req.query.id);
    const title = req.body.title;
    const text = req.body.text;
    const isCompleted = req.body.isCompleted;
    const token = req.headers.authorization?.split(" ")[1];
    if (!title || !id || !text) {
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
                .json({ message: "You don't have permission to update TODO" });
        }
        const result = db.query(
            `UPDATE todo SET title=$1, text=$2, isCompleted=$3 WHERE id=$4 RETURNING *`,
            [title, text, isCompleted, id]
        );
        result.then((result) => {
            return res.json({
                message: "TODO Updated Sucssecfully",
                data: result.rows[0],
            });
        });
    });
};
