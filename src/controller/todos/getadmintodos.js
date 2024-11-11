import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const getadmintodos = async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res
            .status(403)
            .json({ message: "You don't have permission to view admin TODOS" });
    }
    const result = await db.query(`SELECT * FROM todo`);
    res.json({ TODOS: result.rows });
};
