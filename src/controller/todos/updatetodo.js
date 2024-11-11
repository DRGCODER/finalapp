import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const updateT = function (req, res) {
    const { id } = req.user;
    const { title, text, isCompleted } = req.body.toLowerCase();
    if (!title || !text || !isCompleted) {
        return res.status(400).json({
            blankFeilds: "Missing required fields",
        });
    }
    if (title.length < 4 || text.length < 4) {
        return res.status(400).json({
            shortFeilds: "Title and text must be at least 4 characters long",
        });
    }
    if (isCompleted !== "true" && isCompleted !== "false") {
        return res.status(400).json({
            isCompleted: "isCompleted must be true or false",
        });
    }
    try {
        const result = db.query(
            `UPDATE todo SET title=$1, text=$2, isCompleted=$3 WHERE id=$4 RETURNING *`,
            [title, text, isCompleted, id]
        );
        result.then((result) => {
            return res.json({
                Success: "TODO Updated Sucssecfully",
                updateTodo: result.rows[0],
            });
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "An error occurred while updating TODO" });
    }
};
