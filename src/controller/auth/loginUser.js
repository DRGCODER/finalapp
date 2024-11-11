import bcrypt from 'bcryptjs';
import db from "../../db/db_config.js";
import jwt from "jsonwebtoken"
import env from "dotenv";


env.config();
export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    } else if (username.length < 4 && username.length > 50) {
        return res.status(400).json({ username: "Username must be at least 4 characters long and less than 50" });
    } else if (password.length < 8 && password.length > 50) {
        return res.status(400).json({ password: "Password must be at least 8 characters long and less than 50" });
    }
    try {
        const checkUser = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = checkUser.rows[0];
        if (!user) {
            return res.status(404).json({ 'message': 'User not found. Try and Register a New Account' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.sendStatus(401).json({ 'message': 'Password mismatch. Renter The Password' });
        }
        // TODO: UserID To Token => Done
        const accessToken = jwt.sign(
            { "username": user.username, "role": user.userrole, "id": user.id },
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { "username": user.username },
            process.env.JWT_REFRESH_TOKEN,
            { expiresIn: '1d' }
        );
        await db.query(
            "UPDATE users SET refresh_token = $1 WHERE username = $2",
            [refreshToken, user.username]
        );
        // TODO: Refresh Token Send IN Body => Done
        return res.json({ token: accessToken, refreshToken: refreshToken });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ 'message': 'Internal Server Error' });
    }
};
