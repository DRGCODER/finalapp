import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();


export const getSingleT = function (req, res) {
    const id = req.query.id;
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
                .json({ message: "You don't have permission to view TODO" });
        } else {
            try {
                const todo = await db.query("SELECT * FROM todo WHERE id=$1", [
                    id,
                ]);
                if (todo.rows.length === 0) {
                    return res.status(404).json({ message: "TODO not found" });
                }
                return res.json({
                    success: true,
                    todo: todo.rows[0],
                });
            } catch (error) {
                console.error("Error fetching TODOS:", error);
                return res
                    .status(500)
                    .json({ message: "An error occurred while fetching TODOS" });
            }
        }
    });
};
