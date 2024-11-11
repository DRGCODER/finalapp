import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const getAllT = async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res
            .status(403)
            .json({
                message: "You don't have permission to view all TODOS only Admin DO",
            });
    } else {
        try {
            const todos = await db.query("SELECT * FROM todo");
            return res.json({
                success: true,
                TODOS: todos.rows,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            return res
                .status(500)
                .json({ message: "An error occurred while fetching users" });
        }
    }
};
