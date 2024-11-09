import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const deleteT = function (req, res) {
    const id = parseInt(req.query.id);
    const token = req.headers.authorization?.split(" ")[1];
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
                .json({ message: "You don't have permission to delete todo" });
        }
        try {
            await db.query("DELETE FROM todo where id = $1", [id]);
            return res.json({
                success: true,
                message: "TODO deleted successfully",
            });
        } catch (error) {
            console.error("An error occurred", error);
            return res
                .status(500)
                .json({ message: "An error occurred while deleteing TODO" });
        }
    });
};
