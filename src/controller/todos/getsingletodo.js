import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const getSingleT = async (req, res) => {
    const { role, id } = req.user;
    if (role !== "admin") {
        return res
            .status(403)
            .json({ message: "You don't have permission to view TODO" });
    } else {
        try {
            const todo = await db.query("SELECT * FROM todo WHERE id=$1", [id]);
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
};
