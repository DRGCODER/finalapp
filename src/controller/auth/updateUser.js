
import db from "../../db/db_config.js";
import env from "dotenv";
import bcrypt from "bcryptjs";

env.config();

export const updateUser = function (req, res) {
    const { usernamereq, password, userRole } = req.body;
    const { id, role } = req.user;
    if (userRole !== "user" && userRole !== "admin") {
        return res.status(400).json({ userRole: "Invalid User Role Please Enter User Or Admin" });

    } else if (usernamereq.length < 4 && usernamereq.length > 50) {
        return res.status(400).json({ username: "Username must be at least 4 characters long and less than 50" });
    } else if (password.length < 8 && password.length > 50) {
        return res.status(400).json({ password: "Password must be at least 8 characters long and less than 50" });
    }
    if (role !== "admin") {
        return res
            .status(403)
            .json({ message: "You don't have permission to update user" });
    }
    // TODO: validate content before updating => Done
    bcrypt.hash(password, 10).then((hash) => {
        const result = db.query(
            `UPDATE users SET username=$1, password=$2, userrole=$3 WHERE id=$4 RETURNING *`,
            [usernamereq, hash, userRole, id]
        );
        result.then((result) => {
            return res.json({
                message: "User Updated Sucssecfully",
                data: result.rows[0],
            });
        });
    });
};
