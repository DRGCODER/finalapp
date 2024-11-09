import db from "../../db/db_config.js";

export const createT = function (req, res) {
    const { title, text, isCompleted } = req.body;
    if (!title || !text) {
        return res.status(400).json({
            blankFeils: "Missing required fields",
        });
    } else {
        const userResult = db.query(`SELECT * FROM users`);
        userResult.then((userResult) => {
            const userId = userResult.rows[0].id;
            const result = db.query(
                `INSERT INTO todo (title, text, isCompleted, user_id) VALUES ($1,$2,$3,$4) RETURNING *`,
                [title, text, isCompleted, userId]
            );
            result.then((result) => {
                return res.json({
                    message: "TODO Created Sucssecfully",
                    data: result.rows[0],
                });
            });
        });
    }
};
