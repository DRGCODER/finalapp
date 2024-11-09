import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();
export const getAllTodosWPAG = (req, res) => {
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
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;

        try {
            const totalTodosResult = await db.query(
                "SELECT COUNT(*) AS count FROM todo"
            );
            const totalTodos = totalTodosResult.rows[0].count;
            const todos = await db.query("SELECT * FROM todo LIMIT $1 OFFSET $2", [
                limit,
                offset,
            ]);
            const totalPages = Math.ceil(totalTodos / limit);

            return res.status(200).json({
                success: true,
                users: todos.rows,
                pagination: {
                    totalTodos,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            });
        } catch (error) {
            console.error("Error fetching TODOS:", error);
            return res
                .status(500)
                .json({ message: "An error occurred while fetching TODOS" });
        }
    });
};
