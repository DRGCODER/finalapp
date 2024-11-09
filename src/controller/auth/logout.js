export default function logoutUser(req, res) {
    const cookie = req.headers.authorization?.cookie;
    console.log(cookie);
    if (cookie?.jwt) {
        res.clearCookie('jwt', {
            sameSite: 'None',
            secure: true,
            httpOnly: true,
            maxAge: 0,
        });
        return res.json({ message: "User Logged Out Sucessefully" });
    } else {
        return res.status(401).json({ message: "User Not Logged In" });
    }
}