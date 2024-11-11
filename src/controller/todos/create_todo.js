import db from "../../db/db_config.js";

export const createT = function (req, res) {
    const { title, text, isCompleted } = req.body;
    const id = req.user.id;
    if (!title || !text || !isCompleted) {
        return res.status(400).json({
            blankFeilds: "Missing required fields",
        });
    } else if (title.length < 4 || text.length < 4) {
        return res.status(400).json({
            shortFeilds: "Title and text must be at least 4 characters long",
        });
    } else if (isCompleted !== "true" && isCompleted !== "false") {
        return res.status(400).json({
            isCompleted: "isCompleted must be true or false",
        });
    } else {
        const result = db.query(
            `INSERT INTO todo (title, text, isCompleted, user_id) VALUES ($1,$2,$3,$4) RETURNING *`,
            [title.toLowerCase(), text.toLowerCase(), isCompleted.toLowerCase(), id]
        );
        result.then((result) => {
            return res.json({
                message: "TODO Created Sucssecfully",
                data: result.rows[0],
            });
        });
    }
};
