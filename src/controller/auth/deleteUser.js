import db from "../../db/db_config.js";

export const deleteUserFromDB = async (req, res) => {
    const { id } = req.user;
    try {
        await db.query("DELETE FROM users where id = $1", [id]);
        return res.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("An error occurred", error);
        return res
            .status(500)
            .json({ message: "An error occurred while deleteing user" });
    }
};
