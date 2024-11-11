import db from "../../db/db_config.js";

export const getAllUsersWPAG = async (req, res) => {
    const { role } = req.user;
    const { offset, limit } = req.pagination;
    if (role !== "admin") {
        return res
            .status(403)
            .json({ message: "You don't have permission to view all users" });
    }
    try {
        const totalUsersResult = await db.query(
            "SELECT COUNT(*) AS count FROM users"
        );
        const totalUsers = parseInt(totalUsersResult.rows[0].count);
        const users = await db.query("SELECT * FROM users LIMIT $1 OFFSET $2", [
            limit,
            offset,
        ]);
        const totalPages = Math.ceil(totalUsers / limit);
        return res.status(200).json({
            success: true,
            users: users.rows,
            pagination: {
                totalUsers: totalUsers,
                totalPages: totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching users" });
    }

};
