import db from "../../db/db_config.js";

export const deleteT = async (req, res) => {
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
        await db.query("DELETE FROM todo where id = $1", [id]);
        return res.json({
            success: true,
            message: "TODO deleted successfully",
        });
    } catch (error) {
        console.error("An error occurred", error);
        return res.status(500).json({
            message: "An error occurred while deleteing TODO Please try again later",
        });
    }
};
