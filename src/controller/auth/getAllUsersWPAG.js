import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();
export const getAllUsersWPAG = (req, res) => {
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
                .json({ message: "You don't have permission to view all users" });
        }
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;

        try {
            const totalUsersResult = await db.query(
                "SELECT COUNT(*) AS count FROM users"
            );
            const totalUsers = totalUsersResult.rows[0].count;
            const users = await db.query("SELECT * FROM users LIMIT $1 OFFSET $2", [
                limit,
                offset,
            ]);
            const totalPages = Math.ceil(totalUsers / limit);

            return res.status(200).json({
                success: true,
                users: users.rows,
                pagination: {
                    totalUsers,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            return res
                .status(500)
                .json({ message: "An error occurred while fetching users" });
        }
    });
};
