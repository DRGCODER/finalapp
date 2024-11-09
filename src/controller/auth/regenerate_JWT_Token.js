import jwt from "jsonwebtoken";
import db from "../../db/db_config.js";


export const handleRefreshToken = async (req, res) => {
    const token = req.cookies;
    if (!token?.jwt) {
        return res.status(401).json({ 'message': 'No refresh token found' });
    }

    const refreshToken = token.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const checkUser = await db.query("SELECT * FROM users WHERE username = $1", [decoded.username]);
        const user = checkUser.rows[0];
        if (!user || user.refresh_token !== refreshToken) {
            return res.status(403).json({ 'message': 'Invalid refresh token' });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { username: user.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        // Generate new refresh token (rotate)
        const newRefreshToken = jwt.sign(
            { username: user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Store the new refresh token in the DB
        await db.query("UPDATE users SET refresh_token = $1 WHERE username = $2", [newRefreshToken, user.username]);

        // Set new refresh token as a cookie
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        // Send new access token
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Refresh Token Error:', err);
        res.status(403).json({ 'message': 'Invalid refresh token' });
    }
};
