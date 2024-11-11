import db from "../../db/db_config.js";

export const getAllUsers = async (req, res) => {
    const { role } = req.user;
    try {
        const users = await db.query("SELECT * FROM users");
        if (role === "admin") {
            return res.json({
                success: true,
                users: users.rows,
            });
        } else {
            return res
                .status(403)
                .json({ message: "You don't have permission to view all users" });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching users" });
    }
};
