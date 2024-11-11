export const paginationMiddleware = (req, res, next) => {
    const { page, limit } = req.body;
    const offset = (page - 1) * limit;
    if (!limit || !page) {
        return res.status(400).json({ blankFeild: "Page and limit are required" });
    } else if (isNaN(page) || isNaN(limit)) {
        return res.status(400).json({ error: "Page and limit must be numbers" });
    } else if (page < 1 || limit < 1 || page === 0 || limit === 0) {
        return res.status(400).json({ error: "Invalid page or limit must be more than 0" });
    } else if (limit > 50) {
        return res
            .status(400)
            .json({ error: "Limit must be less than or equal to 50" });
    } else {

        req.pagination = { offset, limit, page };


        next();
    }
}