import db from "../../db/db_config.js";



export const changeUserRole = async (req, res) => {
    const { id, role } = req.user;
    const userRole = req.body.userRole.toLowerCase();
    if (role !== "admin") {
        return res.status(403).json({
            message: "You don't have permission to change user role only Admin DO",
        });
    } else {
        if (!userRole) {
            return res.status(400).json({
                blankFeils: "Missing required fields",
            });
        } else if (userRole !== "user" && userRole !== "admin") {
            return res
                .status(400)
                .json({ userRole: "Invalid User Role Please Enter User Or Admin" });
        }
        const result = await db.query(
            `UPDATE users SET userrole=$1 WHERE id=$2 RETURNING *`,
            [userRole, id]
        );
        res.json({
            status: "User Role Updated Sucseccfully",
            updateUser: result.rows[0],
        });
    }
};
