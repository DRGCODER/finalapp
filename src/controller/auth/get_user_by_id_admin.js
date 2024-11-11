
import db from "../../db/db_config.js";

export const getUserByIdAdmin = async (req, res) => {
    const { role } = req.user;
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({
            blankFeils: "Missing required fields",
        });
    } else if (isNaN(id)) {
        return res.status(400).json({
            id: "id must be a number",
        });
    }
    try {
        if (role !== "admin") {
            return res
                .status(403)
                .json({ message: "You don't have permission to view user" });
        } else {
            const user = await db.query("SELECT * FROM users WHERE id=$1", [id]);
            if (user.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json({
                success: true,
                user: user.rows[0],
            });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user" });
    }
};