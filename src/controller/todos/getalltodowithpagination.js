import db from "../../db/db_config.js";


export const getAllTodosWPAG = async (req, res) => {
    const { offset, limit, page } = req.pagination;
    const { id } = req.user;
    try {
        const totalTodosResult = await db.query(
            "SELECT COUNT(*) AS count FROM todo"
        );
        const totalTodos = totalTodosResult.rows[0].count;
        const todos = await db.query("SELECT * FROM todo WHERE user_id=$3 LIMIT $1 OFFSET $2", [
            limit,
            offset,
            id,
        ]);
        const totalPages = Math.ceil(totalTodos / limit);
        return res.status(200).json({
            success: true,
            title: todos.rows[0].title,
            id: todos.rows[0].id,
            pagination: {
                totalTodos: totalTodos,
                totalPages: totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });

    } catch (error) {
        console.error("Error fetching TODOS:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching TODOS" });
    }
};
