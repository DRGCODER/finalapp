import db from "../../db/db_config.js";

export const userProfile = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await db.query("SELECT * FROM users WHERE id=$1", [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            success: true,
            user: user.rows[0],
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user" });
    }
};
