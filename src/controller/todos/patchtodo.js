import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const patchT = function (req, res) {
    const isCompleted = req.body.isCompleted;
    const id = req.user.id;
    if (!isCompleted) {
        return res.status(400).json({
            blankFeils: "Missing required fields",
        });
    }
    if (isCompleted !== "true" && isCompleted !== "false") {
        return res.status(400).json({
            isCompleted: "isCompleted must be true or false",
        });
    }
    const result = db.query(
        `UPDATE todo SET isCompleted=$1 WHERE id=$2 RETURNING *`,
        [isCompleted, id]
    );
    result.then((todo) => {
        res.json({
            status: "User Role Updated Sucseccfully",
            updatedTODO: todo.rows[0],
        });
    });
};
