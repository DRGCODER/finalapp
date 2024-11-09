import bcrypt from 'bcryptjs';
import db from "../../db/db_config.js";
import jwt from "jsonwebtoken"
import env from "dotenv";


env.config();
export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    try {
        const checkUser = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = checkUser.rows[0];
        if (!user) {
            return res.status(404).json({ 'message': 'User not found. Try and Register a New Account' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.sendStatus(401).json({ 'message': 'Password mismatch. REnter The Password' });
        }
        const accessToken = jwt.sign(
            { "username": user.username, "role": user.userrole },
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
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.json({ accessToken });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ 'message': 'Internal Server Error' });
    }
};
