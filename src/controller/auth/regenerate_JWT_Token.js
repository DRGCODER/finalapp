import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";
import env from "dotenv";

env.config();

export const handleRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.jwt;
    const token = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token found" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid refresh token" });
        } else {
            const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
            const newAccessToken = jwt.sign(
                { username: user.username, role: user.userrole, id: user.id },
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: "1h" }
            );
            const newRefreshToken = jwt.sign(
                { username: user.username },
                process.env.JWT_REFRESH_TOKEN,
                { expiresIn: "1d" }
            );
            await db.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
                newRefreshToken,
                user.id,
            ]);
            // TODO: send new refresh token and new access token in response body => DONE
            return res.json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        }
    } catch (err) {
        console.error("Refresh Token Error:", err);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
