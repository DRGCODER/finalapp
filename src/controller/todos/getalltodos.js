import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const getAllT = (req, res) => {
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
                .json({ message: "You don't have permission to view all TODOS" });
        }
        try {
            const todos = (await db.query("SELECT * FROM todo")).rows;

            return res.json({
                success: true,
                todos,
            });

        } catch (error) {
            console.error("Error fetching users:", error);
            return res
                .status(500)
                .json({ message: "An error occurred while fetching users" });
        }
    });
};
